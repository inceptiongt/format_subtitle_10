import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {subtitle_item} from '../src/formatSubtitle'
type Picks = number[]

// 各种字幕 item 的情况，包括一个符号、连个符号
// 
const subtitleItems: Record<string, subtitle_item> = {
    subtitleItem1: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干一若干一若干一若干一若干一若干一若干一若干一若干一若干一。"
        } ]
    },
    subtitleItem2: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干二若干二若干二若干二若干二若干二若干二若干二若干二若干二，"
        } ]
    },
    subtitleItem3: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干三若干三若干三若干三若干三。若干三若干三若干三若干三若干三"
        } ]
    },
    subtitleItem4: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干四若干四若干四若干四若干四，若干四若干四若干四若干四若干四"
        } ]
    },
    // 两个
    subtitleItem5: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "，若干五若干五若干，五若干五若干五若干五若干五若干五若干五若干五"
        } ]
    },
    subtitleItem6: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "。若干六若干六若干六若干六若干六，若干六若干六若干六若干六若干六"
        } ]
    },
    subtitleItem7: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干七若干七若干，七若干七若干七。若干七若干七若干七若干七若干七"
        } ]
    },
    subtitleItem8: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干八若干八若干八若干八若干八。若干八若干八若干。八若干八若干八"
        } ]
    },
    subtitleItem9: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干九若干九若干九若干九若干九。若干九若干九若干。九若干九若干九"
        } ]
    },
    subtitleItem10: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干十若干十若干十若干若干十若干十若干十若干，十若干十若干十。"
        } ]
    },

    //三个符号
    subtitleItem11: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干壹若干壹若干。壹若干壹若干壹，若干壹若干壹若干壹若干壹若干壹。"
        } ]
    },
    subtitleItem12: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干贰若干贰若干，贰若干贰若干贰若干贰若干贰若干。贰若干贰若干贰，"
        } ]
    },
    subtitleItem13: {
        "tStartMs": 11000,
        "dDurationMs": 4000,
        "segs": [ {
            "utf8": "若干叁若干叁若干。叁若干叁若干叁。若干叁若干若干。叁若干叁若干叁"
        } ]
    }
}

const DEFAULT_SUBTITLE_INDEX = 0
const TOTAL_SUBTITLE_COUNT = Object.keys(subtitleItems).length

const assertIndexInRange = (index: number) => {
    if (!Number.isInteger(index)) {
        throw new TypeError(`字幕索引必须为整数，但收到 ${index}`)
    }
    if (index < 1 || index > TOTAL_SUBTITLE_COUNT) {
        throw new RangeError(`字幕索引 ${index} 超出范围，允许的范围为 1-${TOTAL_SUBTITLE_COUNT}`)
    }
}

const resolveIndex = (index: number) => {
    assertIndexInRange(index)
    const key = `subtitleItem${index}`
    return subtitleItems[key]
}

/**
 * @example
 * 如果 items = [1,2,3]，则返回 变量 subtitleItem1、subtitleItem2、subtitleItem3 组成的数组。
 * 
 * */ 

export const pickItems = (items: Picks): subtitle_item[] => {
    if (!Array.isArray(items) || items.length === 0) {
        const defaultItem = resolveIndex(DEFAULT_SUBTITLE_INDEX + 1)
        return [{
            ...defaultItem,
            segs: defaultItem.segs.map((seg) => ({ ...seg })),
            tStartMs: 0,
        }]
    }

    return items.map((itemIndex, idx) => {
        const baseItem = resolveIndex(Number(itemIndex))
        const clonedSegs = baseItem.segs.map((seg) => ({ ...seg }))

        const tStartMs = idx * 5000

        return {
            ...baseItem,
            segs: clonedSegs,
            tStartMs,
        }
    })
}

/**
 * @example
 * // for picks
    // rst[pick[i]] = pickItems(pick[i] 
    // 保存 rst 为json 文件
 * 
 * */ 

export const genTestDataFile = (picks: Picks[]) => {
    const resolvedPicks = Array.isArray(picks) ? picks : []
    const rst: Record<string, subtitle_item[]> = {}

    resolvedPicks.forEach((pick) => {
        const normalizedPick = Array.isArray(pick) ? pick : []
        const key = normalizedPick.length > 0
            ? normalizedPick.map((item) => Number(item)).join('-')
            : 'default'
        rst[key] = pickItems(normalizedPick)
    })

    const outputFilePath = join(process.cwd(), 'test', 'TestData.json')
    mkdirSync(dirname(outputFilePath), { recursive: true })
    writeFileSync(outputFilePath, JSON.stringify(rst, null, 2), { encoding: 'utf-8' })
    return outputFilePath
}

export const subtitles = [
    [1,2,3,4],
    [2,3,4,5],
    [6,7,8,9],
    [10,11,12,13],
]

genTestDataFile(subtitles)
