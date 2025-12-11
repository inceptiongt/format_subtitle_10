#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { formatSubtitle, _formatSubtitle } from './formatSubtitle';
import { formatSubtitleForEnglish, _formatSubtitleForEnglish } from './formatSubtitleForEnglish';
import { subArr2Srt } from './subArr2Srt';
import { toMd } from './subArr2Md';

const usage = () => {
  console.error('Usage: formatsubtitle <input.json> [--debug|-d] [-en] [-md]');
  console.error('  -en    : also generate English .srt from corresponding <base>.en.json3');
  console.error('  -md    : also generate merged .md (requires -en); chapters taken from <base>.info.json');
  process.exit(2);
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    usage();
  }

  // Support a debug flag anywhere in the args: --debug or -d
  const debugIndex = args.findIndex((a) => a === '--debug' || a === '-d');
  const debug = debugIndex !== -1;
  if (debug) args.splice(debugIndex, 1);

  // Support language-related flags and additional behaviors
  // --debug/-d already handled above. Add: -en and -md
  let lang = 'zh';
  let produceEn = false;
  let produceMd = false;

  // parse simple flags anywhere
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-en' || a === '--en') {
      produceEn = true;
      args.splice(i, 1);
      i--;
      continue;
    }
    if (a === '-md' || a === '--md') {
      produceMd = true;
      // -md implies -en (we need English to build merged MD)
      produceEn = true;
      args.splice(i, 1);
      i--;
      continue;
    }

    // backward-compatible language flag support
    if (a.startsWith('--lang=') || a.startsWith('-lang=')) {
      lang = a.split('=')[1] || 'zh';
      args.splice(i, 1);
      i--;
      continue;
    }

    if (a === '--lang' || a === '-lang' || a === '-l') {
      const value = args[i + 1];
      if (typeof value === 'string') {
        lang = value;
        args.splice(i, 2);
        i -= 1;
      } else {
        args.splice(i, 1);
        i -= 1;
      }
      continue;
    }
  }

  lang = String(lang || 'zh').toLowerCase();

  const inputPath = path.resolve(process.cwd(), args[0]);

  try {
    const raw = await fs.readFile(inputPath, 'utf-8');
    const doc = JSON.parse(raw);

    // The examples place subtitle items under `events`.
    const items = Array.isArray(doc.events) ? doc.events : doc;

    // Format Chinese (input assumed to be Chinese by default)
    const formattedZh = formatSubtitle(items as any);

    // If debug mode is enabled, write the formatted object to a JSON file
    if (debug) {
      try {
        const jsonOutName = `${path.basename(inputPath, path.extname(inputPath))}.formatted.json`;
        const jsonOutPath = path.join(path.dirname(inputPath), jsonOutName);
        await fs.writeFile(jsonOutPath, JSON.stringify(formattedZh, null, 2), 'utf-8');
        console.log(`Wrote formatted JSON to ${jsonOutPath}`);
      } catch (writeErr: any) {
        console.error('Error writing formatted JSON:', writeErr && writeErr.message ? writeErr.message : String(writeErr));
      }
    }

    // Write Chinese SRT (default behavior)
    const zhSrt = subArr2Srt(formattedZh as any);
    const ext = path.extname(inputPath);
    const nameNoExt = path.basename(inputPath, ext);
    const outName = `${nameNoExt}.srt`;
    const outPath = path.join(path.dirname(inputPath), outName);
    await fs.writeFile(outPath, zhSrt, 'utf-8');
    console.log(`Wrote ${outPath}`);

    // attempt to derive base prefix (strip trailing language token like `.zh-Hans` or `.en`)
    const deriveBasePrefix = (name: string) => {
      const idx = name.lastIndexOf('.');
      if (idx === -1) return name;
      const lastToken = name.slice(idx + 1);
      // treat last token as language if it looks like alpha or hyphen sequence (e.g. zh, zh-Hans, en)
      if (/^[a-z]{1,8}(-[A-Za-z0-9]+)*$/i.test(lastToken)) {
        return name.slice(0, idx);
      }
      return name;
    }

    const basePrefix = deriveBasePrefix(nameNoExt);

    // If English requested, read corresponding english source and produce english srt
    let formattedEn: any = null;
    if (produceEn) {
      const enFilename = `${basePrefix}.en${ext}`;
      const enPath = path.join(path.dirname(inputPath), enFilename);
      try {
        const rawEn = await fs.readFile(enPath, 'utf-8');
        const docEn = JSON.parse(rawEn);
        const itemsEn = Array.isArray(docEn.events) ? docEn.events : docEn;
        formattedEn = formatSubtitleForEnglish(itemsEn as any);

        if (debug) {
          try {
            const enJsonOutName = `${basePrefix}.en.formatted.json`;
            const enJsonOutPath = path.join(path.dirname(inputPath), enJsonOutName);
            await fs.writeFile(enJsonOutPath, JSON.stringify(formattedEn, null, 2), 'utf-8');
            console.log(`Wrote formatted English JSON to ${enJsonOutPath}`);
          } catch (we: any) {
            console.error('Error writing formatted English JSON:', we && we.message ? we.message : String(we));
          }
        }

        const enSrt = subArr2Srt(formattedEn as any);
        const enOutName = `${basePrefix}.en.srt`;
        const enOutPath = path.join(path.dirname(inputPath), enOutName);
        await fs.writeFile(enOutPath, enSrt, 'utf-8');
        console.log(`Wrote ${enOutPath}`);
      } catch (e: any) {
        console.error(`Could not generate English SRT from ${enPath}:`, e && e.message ? e.message : String(e));
      }
    }

    // If MD requested, load chapters from <base>.info.json and call toMd
    if (produceMd) {
        try {
          // Try to read chapters from info file. If it fails, continue with chapters === undefined
          let chapters: any | undefined = undefined;
          try {
            const infoPath = path.join(path.dirname(inputPath), `${basePrefix}.info.json`);
            const rawInfo = await fs.readFile(infoPath, 'utf-8');
            const infoDoc = JSON.parse(rawInfo);
            chapters = Array.isArray(infoDoc.chapters) ? infoDoc.chapters : undefined;
          } catch (infoErr: any) {
            console.error(`Could not read chapters from info file: ${infoErr && infoErr.message ? infoErr.message : String(infoErr)}. Proceeding with generated chapters.`);
            chapters = undefined;
          }

          // Read English source items (best-effort). If it fails, use empty array.
          let itemsEn: any = [];
          try {
            const enFilename = `${basePrefix}.en${ext}`;
            const enPath = path.join(path.dirname(inputPath), enFilename);
            const rawEn = await fs.readFile(enPath, 'utf-8');
            const docEn = JSON.parse(rawEn);
            itemsEn = Array.isArray(docEn.events) ? docEn.events : docEn;
          } catch (enErr: any) {
            console.error(`Could not read English source for MD: ${enErr && enErr.message ? enErr.message : String(enErr)}. English sections will be empty.`);
            itemsEn = [];
          }

          // Call toMd with the new object argument shape. Pass raw subtitle_item[] arrays; toMd will format them.
          const md = toMd({ chapters, zh_subtitle: items as any, en_subtitle: itemsEn as any });
          const mdOutPath = path.join(path.dirname(inputPath), `${basePrefix}.md`);
          await fs.writeFile(mdOutPath, md, 'utf-8');
          console.log(`Wrote ${mdOutPath}`);
        } catch (mdErr: any) {
          console.error('Error generating MD:', mdErr && mdErr.message ? mdErr.message : String(mdErr));
        }
    }
  } catch (err: any) {
    console.error('Error:', err && err.message ? err.message : String(err));
    process.exit(1);
  }
};

import { fileURLToPath } from 'url';

const isMain = (() => {
  try {
    const entry = process.argv[1];
    const thisFile = fileURLToPath(import.meta.url);
    return entry === thisFile;
  } catch {
    return false;
  }
})();

if (isMain) {
  main();
}
