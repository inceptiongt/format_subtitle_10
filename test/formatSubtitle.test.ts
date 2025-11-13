import { expect, test } from '@rstest/core';

import { formatSubtitle } from '../src/formatSubtitle';
import TestData from './TestData.json'
import { subtitles } from './genTestData';

const subtitleNames = subtitles.map(i => i.join('-'))

test(subtitleNames[0], () => {
  const subtitle = formatSubtitle(TestData[subtitleNames[0]])

  expect(subtitle).toMatchSnapshot(
    [
      {
        "tStartMs": 0,
        "dDurationMs": 4000,
        "segs": [
          {
            "utf8": "若干一若干一若干一若干一若干一若干一若干一若干一若干一若干一。"
          }
        ]
      },
      {
        "tStartMs": 5000,
        "dDurationMs": 4000,
        "segs": [
          {
            "utf8": "若干二若干二若干二若干二若干二若干二若干二若干二若干二若干二，"
          }
        ]
      },
      {
        "tStartMs": 10000,
        "dDurationMs": expect.toBeWithin(2000,2500),
        "segs": [
          {
            "utf8": "若干三若干三若干三若干三若干三。"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(12000,12500),
        "dDurationMs": expect.toBeWithin(4500,5500),
        "segs": [
          {
            "utf8": "若干三若干三若干三若干三若干三若干四若干四若干四若干四若干四，"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(17000,17500),
        "dDurationMs": expect.toBeWithin(1500,2500),
        "segs": [
          {
            "utf8": "若干四若干四若干四若干四若干四"
          }
        ]
      }
    ]
  )
})

test(subtitleNames[3], () => {
  const subtitle = formatSubtitle(TestData[subtitleNames[3]])

  expect(subtitle).toMatchSnapshot(
    [
      {
        "tStartMs": 0,
        "dDurationMs": expect.toBeWithin(2500, 3500),
        "segs": [
          {
            "utf8": "若干十若干十若干十若干若干十若干十若干十若干，"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(2500, 3500),
        "dDurationMs": expect.toBeWithin(500, 1500),
        "segs": [
          {
            "utf8": "十若干十若干十。"
          }
        ]
      },
      {
        "tStartMs": 5000,
        "dDurationMs": expect.toBeWithin(500, 1500),
        "segs": [
          {
            "utf8": "若干壹若干壹若干。"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(5500, 6500),
        "dDurationMs": expect.toBeWithin(2500, 3500),
        "segs": [
          {
            "utf8": "壹若干壹若干壹若干，壹若干壹若干壹若干壹若干壹。"
          }
        ]
      },
      {
        "tStartMs": 10000,
        "dDurationMs": expect.toBeWithin(2500, 3500),
        "segs": [
          {
            "utf8": "若干贰若干贰若干，贰若干贰若干贰若干贰若干贰若。"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(12500, 13500),
        "dDurationMs": expect.toBeWithin(2500, 3500),
        "segs": [
          {
            "utf8": "干贰若干贰若干贰，若干叁若干叁若。"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(15500, 16500),
        "dDurationMs": expect.toBeWithin(500, 1500),
        "segs": [
          {
            "utf8": "干叁若干叁若干叁。"
          }
        ]
      },
      {
        "tStartMs": expect.toBeWithin(16500, 17500),
        "dDurationMs": expect.toBeWithin(1500, 2500),
        "segs": [
          {
            "utf8": "若干叁若干若，干叁若干叁若干叁"
          }
        ]
      }
    ]
  )
})

// test(subtitleNames[2], () => {
//   expect(TestData[subtitleNames[2]]).toMatchSnapshot()
// })

// test(subtitleNames[3], () => {
//   expect(TestData[subtitleNames[3]]).toMatchSnapshot()
// })



  