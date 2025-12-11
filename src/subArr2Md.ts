import {_formatSubtitle} from './formatSubtitle';
import type { subtitle_item, result_item, CharTiming } from './formatSubtitle';

import { _formatSubtitleForEnglish } from './formatSubtitleForEnglish';

interface Chapter {
    start_time: number;
    end_time: number;
    title: string;
}

/**
 * @description 转换成 md 文档
 * 把中文和英文的字幕合并在一起，形成一个 md 文档，根据章节信息进行分割，分为多个标题
 * --------------------------
 * 章节信息格式如下：
 * "chapters": [
        {
            "start_time": 0.0,
            "title": "Introduction",
            "end_time": 37.0
        },
        {
            "start_time": 37.0,
            "title": "How the exploration started",
            "end_time": 140.0
        },
        {
            "start_time": 140.0,
            "title": "1492",
            "end_time": 296.0
        },
        {
            "start_time": 296.0,
            "title": "Treaty of Tordesillas",
            "end_time": 423.0
        }
    ...]

    中文、英文字幕的格式为 result_item[]

    --------------------------
    合并成的 md 文件格式如下：
    # 章节标题
    章节时间

    章节时间内的中文字幕内容
    
    章节时间内的英文字幕内容

    --------------------------

 * 字幕内容的格式有要求，需要换行显示，['；','。','？','！']这些符号结尾的地方需要换行。去除行首、行尾的空格和中间的换行符。
 * 
 * @param chapters 章节信息
 * @param zh_subtitle 中文字幕
 * @param en_subtitle 英文字幕
 * 
 * 
 * 
 * 
 * */ 

export const toMd = (data: {chapters?: Chapter[], zh_subtitle: subtitle_item[], en_subtitle: subtitle_item[]}): string => {
    const { chapters, zh_subtitle, en_subtitle } = data;
    const zh_formatted = _formatSubtitle(zh_subtitle);
    const en_formatted = _formatSubtitleForEnglish(en_subtitle);

    const secondsToHMS = (s: number) => {
        const sec = Math.floor(s);
        const hh = Math.floor(sec / 3600);
        const mm = Math.floor((sec % 3600) / 60);
        const ss = sec % 60;
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
    }

    const sectionParts: string[] = [];

    // If `chapters` is not provided, generate virtual chapters every 10 minutes (600s).
    // Titles follow the four-digit pattern requested: 0000, 1000, 2000, ...
    const chaptersLocal: Chapter[] = (() => {
        if (Array.isArray(chapters) && chapters.length > 0) return chapters as Chapter[];

        // find max time from both zh and en formatted subtitles
        let maxSec = 0;
        const collectMax = (arr: any[]) => {
            arr.forEach(item => {
                const tMs = item && item.tStartMs;
                if (typeof tMs === 'number' && !Number.isNaN(tMs)) {
                    const s = tMs / 1000;
                    if (s > maxSec) maxSec = s;
                }
            });
        };

        collectMax(zh_formatted);
        collectMax(en_formatted);

        // ensure at least one chapter covers some range (default to 10 minutes)
        if (maxSec <= 0) maxSec = 600;

        const chunk = 600; // 10 minutes in seconds
        const count = Math.max(1, Math.ceil(maxSec / chunk));
        const chs: Chapter[] = [];
        for (let i = 0; i < count; i++) {
            const start_time = i * chunk;
            const end_time = (i + 1) * chunk;
            const title = String(i * 1000).padStart(4, '0');
            chs.push({ start_time, end_time: Math.min(end_time, Math.ceil(maxSec)), title });
        }
        return chs;
    })();

    // 合并逗号结尾的 SubtitleItem（中文用全角逗号 '，'，英文用半角逗号 ','）
    const mergeCommaEnding = (items: result_item[], commaChar: string): result_item[] => {
        const out: result_item[] = [];
        let i = 0;
        while (i < items.length) {
            const cur = items[i];
            const curText = cur.segs?.[0]?.utf8 ?? '';

            if (!curText.endsWith(commaChar)) {
                out.push(cur);
                i += 1;
                continue;
            }

            // merge chain starting at i
            let mergedText = curText;
            const startMs = cur.tStartMs;
            let endMs = cur.tStartMs + (cur.dDurationMs ?? 0);

            let j = i + 1;
            while (j < items.length) {
                const next = items[j];
                const nextText = next.segs?.[0]?.utf8 ?? '';
                mergedText += nextText;
                endMs = Math.max(endMs, next.tStartMs + (next.dDurationMs ?? 0));
                j += 1;
                // stop merging if this nextText does not end with commaChar
                if (!nextText.endsWith(commaChar)) break;
            }

            out.push({ tStartMs: startMs, dDurationMs: Math.max(0, Math.round(endMs - startMs)), segs: [{ utf8: mergedText }] });
            i = j;
        }

        return out;
    }

    const zh_merged = mergeCommaEnding(zh_formatted as any, '，');
    const en_merged = mergeCommaEnding(en_formatted as any, ',');

    // use merged arrays for subsequent processing
    const zh_used = zh_merged;
    const en_used = en_merged;

    for (const ch of chaptersLocal) {
        const title = ch.title || '';
        const start = secondsToHMS(ch.start_time ?? 0);
        const end = secondsToHMS(ch.end_time ?? ch.start_time ?? 0);

        sectionParts.push(`# ${title}`);
        sectionParts.push(`${start} - ${end}`);
        sectionParts.push('');

        // collect zh subtitle texts inside chapter time range
        const zhItems = zh_used.filter(item => {
                const tMs = item.tStartMs;
                const t = (typeof tMs === 'number') ? tMs / 1000 : NaN;
                return !Number.isNaN(t) && t >= (ch.start_time ?? 0) && t < (ch.end_time ?? Infinity);
        }).map(i => i.segs?.[0]?.utf8.replace(/\n/g, '').trim())


        if (zhItems.length) {
            sectionParts.push(zhItems.join('\n'));
            sectionParts.push('');
        }

        const enItems = en_used.filter(item => {
                const tMs = item.tStartMs;
                const t = (typeof tMs === 'number') ? tMs / 1000 : NaN;
                return !Number.isNaN(t) && t >= (ch.start_time ?? 0) && t < (ch.end_time ?? Infinity);
        }).map(i => i.segs?.[0]?.utf8.replace(/\n/g, '').trim())

        if (enItems.length) {
            sectionParts.push(enItems.join('\n'));
            sectionParts.push('');
        }
    }

    // join sections and ensure single trailing newline
    return sectionParts.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}