import { expect, test } from '@rstest/core';

import { formatSubtitle } from '../src/formatSubtitle';
import TestData from './TestDataForEnglish.json'
import { subtitles } from './genTestData';

const subtitleNames = subtitles.map(i => i.join('-'))

/**
 * @description
 * 
 * 替换类似"~2000"这种字符串，字符串的含义是：约等于2000。
 * 把它替换成 expect.toBeWithin(1500,2500) 含义是在 1500 与 2500 之间
 * 规则是 ~n -> expect.toBeWithin(n-500, n+500)
 * 
*/

test(subtitleNames[0], () => {
  const subtitle = formatSubtitle(TestData[subtitleNames[0]])

  expect(subtitle).toMatchSnapshot(
    [
        {
          "tStartMs": 0,
          "dDurationMs": 4000,
          "segs": [
            {
              "utf8": "aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa."
            }
          ]
        },
        {
          "tStartMs": 5000,
          "dDurationMs": 4000,
          "segs": [
            {
              "utf8": "bbb bbb bbb bbb bbb bbb bbb bbb bbb bbb bbb bbb,"
            }
          ]
        },
        {
          "tStartMs": 10000,
          "dDurationMs": expect.toBeWithin(1500,2500),
          "segs": [
            {
              "utf8": "ccc ccc ccc ccc ccc ccc."
            }
          ]
        },
        {
          "tStartMs": expect.toBeWithin(11500,12500),
          "dDurationMs": expect.toBeWithin(4500,5500),
          "segs": [
            {
              "utf8": "ccc ccc ccc ccc ccc ccc ddd ddd ddd ddd ddd ddd,"
            }
          ]
        },
        {
          "tStartMs": expect.toBeWithin(16500,17500),
          "dDurationMs": expect.toBeWithin(1500,2500),
          "segs": [
            {
              "utf8": "ddd ddd ddd ddd ddd ddd"
            }
          ]
        }
      ]
    )
        // "dDurationMs": expect.toBeWithin(2000,2500),
})