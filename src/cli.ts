#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { formatSubtitle } from './formatSubtitle';
import { subArr2Srt } from './subArr2Srt';

const usage = () => {
  console.error('Usage: formatSubtitle <input.json>');
  process.exit(2);
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    usage();
  }

  const inputPath = path.resolve(process.cwd(), args[0]);

  try {
    const raw = await fs.readFile(inputPath, 'utf-8');
    // Try to parse JSON. The example files are regular JSON, so JSON.parse should work.
    const doc = JSON.parse(raw);

    // The examples place subtitle items under `events`.
    const items = Array.isArray(doc.events) ? doc.events : doc;

    // Call the library formatter (returns subtitle_item[])
    const formatted = formatSubtitle(items as any);

    // Pass subtitle_item[] directly to subArr2Srt (now accepts subtitle_item[])
    const srt = subArr2Srt(formatted as any);

    const outName = `${path.basename(inputPath, path.extname(inputPath))}.srt`;
    const outPath = path.join(path.dirname(inputPath), outName);

    await fs.writeFile(outPath, srt, 'utf-8');

    console.log(`Wrote ${outPath}`);
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
