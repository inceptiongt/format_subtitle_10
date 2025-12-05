export interface subtitle_item {
  tStartMs: number;
  dDurationMs: number;
  segs: {
    utf8: string;
    tOffsetMs?: number;
  }[];
}


/**
 * 根据字幕的文字内容，按照"完整句子"，重新整理字幕内容
 * @example
 * input:
 * 
 * [ {
    "tStartMs": 11760,
    "dDurationMs": 6640,
    "segs": [ {
      "utf8": "亚洲曾是古代帝国和传奇统治者的土地\n，但"
    } ]
  }, {
    "tStartMs": 18400,
    "dDurationMs": 6960,
    "segs": [ {
      "utf8": "在近代早期沦为不断扩张的欧洲列强的殖民地\n。 受亚洲丝绸和香料贸易的吸引，"
    } ]
  }, {
    "tStartMs": 25360,
    "dDurationMs": 4960,
    "segs": [ {
      "utf8": "他们的殖民努力最初是\n为了利用亚洲大陆的经济"
    } ]
  }, {
    "tStartMs": 30320,
    "dDurationMs": 6160,
    "segs": [ {
      "utf8": "实力。 最终，欧洲国家开始\n使用越来越多的武力，到"
    } ]
  }, {
    "tStartMs": 36480,
    "dDurationMs": 6000,
    "segs": [ {
      "utf8": "20 世纪初，东方世界\n几乎完全掌握在殖民帝国的手中。"
    } ]
  }]
  
  output:
    [ {
    "tStartMs": 11760,
    "dDurationMs": ,
    "segs": [ {
      "utf8": "亚洲曾是古代帝国和传奇统治者的土地\n，但在近代早期沦为不断扩张的欧洲列强的殖民地\n。"
    } ]
  }, {
    "tStartMs": ,
    "dDurationMs": ,
    "segs": [ {
      "utf8": "受亚洲丝绸和香料贸易的吸引，他们的殖民努力最初是\n为了利用亚洲大陆的经济实力。"
    } ]
  }, {
    "tStartMs": ,
    "dDurationMs": ,
    "segs": [ {
      "utf8": " 最终，欧洲国家开始\n使用越来越多的武力，到20 世纪初，东方世界\n几乎完全掌握在殖民帝国的手中。"
    } ]
  }
  ]

  input 中 segs 的字符是一句完整的话的一部分，而 output 中 segs 的字符都是相对完整的一句话
  output 中 tStartMs、dDurationMs需要根据 segs 的内容长度重新计算
  *  
  * ---- 详细说明
  * 
  * 如何拆分、整理字幕？
  * input 数组中包含 “字幕 item” ，字幕 item 中的文字对于句子的完整性来说是乱七八糟的，有很多的情况。
  * 可以参考 genTestData.ts 文件中的 subtitleItems 变量，从逗号、句号的使用上来看，有些“字幕 item”中可能出现零个或多个逗号、句号的情况，还有逗号、句号出现的位置可能出现在文字的开头、中间、结尾的位置。
  * 从第一个“字幕 item”开始，根据逗号、句号拆分，形成新的“字幕 item”
  * 
  * 怎么重新计算tStartMs、dDurationMs 时间戳
  * tStartMs 表示开始时间戳，dDurationMs 表示文字持续时间，根据每个字符在字符串中的 index 以及 字符串的长度 length，得到每个字符的时间戳。
  * 拆分“字幕 item”后，得到新的“字幕 item”。其中的文字的首字符的时间戳为新的tStartMs，dDurationMs=尾字符时间戳-首字符时间戳
  * 
  * 项目包含测试数据，测试用例用于参考
  */
  
export const SenEnd = ['，', '；','。','？','！']

type CharTiming = {
  char: string;
  startMs: number;
  endMs: number;
}

const isSentenceTerminator = (char: string) => SenEnd.includes(char);

const buildCharTimings = (item: subtitle_item): CharTiming[] => {
  const text = item.segs.map((seg) => seg.utf8 ?? '').join('');
  const length = text.length;

  if (length === 0) {
    return [];
  }

  const charDuration = length === 0 ? 0 : item.dDurationMs / length;
  const timings: CharTiming[] = [];

  for (let i = 0; i < length; i += 1) {
    const startMs = item.tStartMs + charDuration * i;
    const endMs = i === length - 1
      ? item.tStartMs + item.dDurationMs
      : item.tStartMs + charDuration * (i + 1);

    timings.push({
      char: text[i],
      startMs,
      endMs,
    });
  }

  return timings;
}

const MIN_COMMA_SEGMENT_LENGTH = 10;

const getTextLength = (text: string) => text.replace(/\s+/g, '').length;

const shouldFlushAtChar = (
  char: string,
  currentText: string,
): boolean => {
  if (!isSentenceTerminator(char)) {
    return false;
  }

  const textWithoutCurrentChar = currentText.slice(0, -1);
  if (getTextLength(textWithoutCurrentChar) === 0) {
    return false;
  }

  if (char === '，') {
    return getTextLength(currentText) >= MIN_COMMA_SEGMENT_LENGTH;
  }

  return true;
}

const normalizeTimestamp = (value: number): number => Math.round(value);

export const formatSubtitle = (subtitle: subtitle_item[]): subtitle_item[] => {
  const flattenedChars: CharTiming[] = subtitle.flatMap(buildCharTimings);

  if (flattenedChars.length === 0) {
    return [];
  }

  const results: subtitle_item[] = [];
  let segmentStartIndex = 0;
  let currentText = '';

  flattenedChars.forEach((charTiming, index) => {
    currentText += charTiming.char;

    const isLastChar = index === flattenedChars.length - 1;
    const needFlush = shouldFlushAtChar(charTiming.char, currentText) || isLastChar;

    if (!needFlush) {
      return;
    }

    const startMs = normalizeTimestamp(flattenedChars[segmentStartIndex].startMs);
    const endMs = normalizeTimestamp(charTiming.endMs);
    const dDurationMs = Math.max(0, endMs - startMs);

    

    // normalize currentText: remove newlines, leading spaces, trailing whitespace,
    // and remove a trailing comma (Chinese or ASCII) if present
    let normalizedText = currentText.replace(/\n+/g, '');
    normalizedText = normalizedText.replace(/^\s+/, '');
    normalizedText = normalizedText.replace(/\s+$/g, '');
    normalizedText = normalizedText.replace(/[，,]$/g, '');

    results.push({
      tStartMs: startMs,
      dDurationMs,
      segs: [
        {
          utf8: normalizedText,
        },
      ],
    });

    segmentStartIndex = index + 1;
    currentText = '';
  });

  return results;
}