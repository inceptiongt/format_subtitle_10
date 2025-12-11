import { expect, test } from '@rstest/core';

import { _formatSubtitleForEnglish } from '../src/formatSubtitleForEnglish';
import TestData from './TestDataForEnglish.json'
import { subtitlesForEnglish } from './genTestData';

const subtitleNames = subtitlesForEnglish.map(i => i.join('-'))

test(subtitleNames[0], () => {
  const subtitle = _formatSubtitleForEnglish(TestData[subtitleNames[0]])

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
        "dDurationMs": expect.toBeWithin(1500,2500),
        "segs": [
          {
            "utf8": " ddd ddd ddd ddd ddd ddd,"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(6500,7500),
        "dDurationMs": expect.toBeWithin(3500,4500),
        "segs": [
          {
            "utf8": " ddd ddd ddd ddd ddd ddd ggg ggg ggg,"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(109500,110500),
        "dDurationMs": expect.toBeWithin(500,1500),
        "segs": [
          {
            "utf8": " ggg ggg ggg,"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(11500,12500),
        "dDurationMs": expect.toBeWithin(5500,6500),
        "segs": [
          {
            "utf8": " ggg ggg ggg ggg ggg ggg jjj jjj jjj jjj jjj jjj jjj jjj jjj."
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(17500,18500),
        "dDurationMs": expect.toBeWithin(500,1500),
        "segs": [
          {
            "utf8": " jjj jjj jjj,"
          }
        ]
      }
    ]
  )
})

test.todo(subtitleNames[1], () => {
  const subtitle = formatSubtitle(TestData[subtitleNames[3]])

  expect(subtitle).toMatchSnapshot(
    [
      {
        "tStartMs": 0,
        "dDurationMs": 4000,
        "segs": [
          {
            "utf8": "bbb bbb bbb bbb bbb bbb bbb bbb bbb bbb bbb bbb, "
          }
        ]
      },
      {
        "tStartMs": 5000,
        "dDurationMs": 4000,
        "segs": [
          {
            "utf8": ". eee eee eee eee eee eee eee eee eee eee eee eee"
          }
        ]
      },
      {
        "tStartMs": 10000,
        "dDurationMs": 4000,
        "segs": [
          {
            "utf8": "hhh hhh hhh hhh hhh hhh hhh hhh hhh, hhh hhh hhh, "
          }
        ]
      },
      {
        "tStartMs": 15000,
        "dDurationMs": 4000,
        "segs": [
          {
            "utf8": ", kkk kkk kkk, kkk kkk kkk kkk kkk kkk, kkk kkk kkk"
          }
        ]
      }
    ],
  )
})

// test(subtitleNames[2], () => {
//   expect(TestData[subtitleNames[2]]).toMatchSnapshot()
// })

// test(subtitleNames[3], () => {
//   expect(TestData[subtitleNames[3]]).toMatchSnapshot()
// })



