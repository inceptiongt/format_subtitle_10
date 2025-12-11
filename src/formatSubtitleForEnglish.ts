import type { subtitle_item, result_item, CharTiming } from './formatSubtitle';

// English sentence terminators. Note: '.' can be a decimal point — handled specially.
const EngSenEnd = [',', ';', '.', '?', '!'];

const isSentenceTerminator = (char: string) => EngSenEnd.includes(char);

const buildCharTimings = (item: subtitle_item): CharTiming[] => {
  if (!item.segs || item.segs.length === 0) return [];

  let text = item.segs.map((s) => s.utf8 ?? '').join('');

  // If this subtitle item does not start at 0 and the text does not begin with
  // a space, prefix a single space so concatenation with previous item keeps
  // a separating space (prevents "...dddddggg..."). This preserves the
  // first item's text unchanged when tStartMs === 0.
  if (typeof item.tStartMs === 'number' && item.tStartMs > 0) {
    if (text.length > 0 && text[0] !== ' ') {
      text = ' ' + text;
    }
  }

  const length = text.length;
  if (length === 0) return [];

  // If any segs include tOffsetMs, use the last tOffsetMs as corrected duration
  const lastSegWithOffset = [...item.segs].reverse().find((s) => typeof s.tOffsetMs === 'number');
  let effectiveDuration = item.dDurationMs;
  if (lastSegWithOffset && typeof lastSegWithOffset.tOffsetMs === 'number') {
    effectiveDuration = lastSegWithOffset.tOffsetMs;
  }

  const charDuration = effectiveDuration > 0 ? effectiveDuration / length : 0;
  const out: CharTiming[] = [];
  for (let i = 0; i < length; i += 1) {
    const startMs = item.tStartMs + charDuration * i;
    const endMs = (i === length - 1) ? (item.tStartMs + effectiveDuration) : (item.tStartMs + charDuration * (i + 1));
    out.push({ char: text[i], startMs, endMs });
  }
  return out;
}

const MIN_COMMA_SEGMENT_LENGTH = 10; // align with Chinese formatter: split on shorter comma segments

// Count words (tokens separated by whitespace) instead of characters.
const getTextLength = (text: string) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const isDigit = (ch: string) => /[0-9]/.test(ch);

const shouldFlushAtChar = (
  char: string,
  currentText: string,
  nextChar?: string,
): boolean => {
  if (!isSentenceTerminator(char)) return false;

  const textWithoutCurrent = currentText.slice(0, -1);
  if (getTextLength(textWithoutCurrent) === 0) return false;

    if (char === ',') {
      // If comma is used as a numeric thousands separator (digit on both sides), do not flush.
      const before = textWithoutCurrent.replace(/\s+$/g, '');
      const prevNonSpace = before.length > 0 ? before[before.length - 1] : undefined;
      if (prevNonSpace && nextChar && isDigit(prevNonSpace) && isDigit(nextChar)) {
        return false;
      }

      return getTextLength(currentText) >= MIN_COMMA_SEGMENT_LENGTH;
    }

  if (char === '.') {
    // If period looks like a decimal point (digit on both sides), do not flush.
    const prev = currentText[currentText.length - 2];
    const next = nextChar ?? '';
    if (prev && isDigit(prev) && next && isDigit(next)) {
      return false;
    }

    // Ellipsis '...' -> only flush on the final dot; the above loop will handle that.
    return true;
  }

  // for '?', '!' and ';' treat as sentence end
  return true;
}

const normalizeTimestamp = (v: number) => Math.round(v);

export const _formatSubtitleForEnglish = (subtitle: subtitle_item[]): result_item[] => {
  const flattened = subtitle.flatMap(buildCharTimings);
  if (flattened.length === 0) return [];

  const results: result_item[] = [];
  let segmentStart = 0;
  let currentText = '';

    for (let i = 0; i < flattened.length; i += 1) {
      const charTiming = flattened[i];

      // find next non-space character in flattened (so we can detect numeric separators like "1,000")
      let nextChar: string | undefined = undefined;
      for (let j = i + 1; j < flattened.length; j += 1) {
        const c = flattened[j].char;
        if (c !== ' ') {
          nextChar = c;
          break;
        }
      }

      currentText += charTiming.char;

    const isLast = i === flattened.length - 1;
    const needFlush = shouldFlushAtChar(charTiming.char, currentText, nextChar) || isLast;
    if (!needFlush) continue;

    const startMs = normalizeTimestamp(flattened[segmentStart].startMs);
    const endMs = normalizeTimestamp(charTiming.endMs);
    const dDurationMs = Math.max(0, endMs - startMs);

    results.push({ tStartMs: startMs, dDurationMs, segs: [{ utf8: currentText }] });

    segmentStart = i + 1;
    currentText = '';
  }

  return results;
}

export const formatSubtitleForEnglish = (subtitle: subtitle_item[]): result_item[] => {
  const raw = _formatSubtitleForEnglish(subtitle);
  return raw.map(({ tStartMs, dDurationMs, segs }) => {
    let text = segs[0].utf8;
    // Normalize whitespace and newlines
    text = text.replace(/\r?\n+/g, ' ');
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/^\s+/, '');
    text = text.replace(/\s+$/, '');
    // Remove trailing comma only; keep periods/question/exclamation
    text = text.replace(/,$/, '');

    return { tStartMs, dDurationMs, segs: [{ utf8: text }] };
  });
}

export default formatSubtitleForEnglish;
