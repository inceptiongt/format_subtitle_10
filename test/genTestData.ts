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
            "utf8": "若干叁若干叁若干。叁若干叁若干叁。若干叁若干若干，叁若干叁若干叁"
        } ]
    }
}

/**
 *  const metaItems = [
 *    "AAAA.",
 *    "BBBB, ",
 *    "CC. CC",
 *    "DD, DD",
 *    ". EEEE",
 *    ", FFFF",
 *    "G, G, GG",
 *    "HHH, H, ",
 *    "I.I, II",
 *    "JJJ. J,",
 *    ", K, KK, K",
 *    "LL. L, L,",
 *    ". M. MMM",
 *    "N, NN. N,"
 *  ]
 * 
 * 填充方法：
 * 第一步：
 * "AAAA." -> "aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa."
 * 'aaa'用来表示一个单词，用'aaa aaa aaa'这三个单词填充每个'A'，保留除了A意外的任意其他字符，可以用正则匹配处理
 * 同理 B 用 bbb 填充，C 用 ccc 填充。
 * 第二步：转换成对象：
 * { 
 *   "AAAA.": "aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa." 
 *   "BBBB, ": "..."
 *   ....
 * 
 * }
 * 
 * 
 * 
 * 
*/
const genMetaItems = (metaItems: string[]): Record<string, string> => {
    const result: Record<string, string> = {}
    
    metaItems.forEach((item) => {
        // 将每个字母替换为对应的三个单词（如 A -> "aaa aaa aaa"）
        // 保留非字母字符（标点、空格等）
        // 如果字母后面还是字母，则在填充字符串后添加空格
        const transformed = item.replace(/[A-Z]/g, (letter, index) => {
            const lowerLetter = letter.toLowerCase()
            const word = lowerLetter.repeat(3) // 生成 "aaa", "bbb" 等
            const threeWords = `${word} ${word} ${word}` // 返回三个单词 "aaa aaa aaa"
            
            // 检查下一个字符是否是字母
            const nextChar = item[index + 1]
            const isNextCharLetter = nextChar && /[A-Z]/.test(nextChar)
            
            // 如果下一个字符是字母，则在末尾添加空格
            return isNextCharLetter ? `${threeWords} ` : threeWords
        })
        
        result[item] = transformed
    })
    
    return result
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

/**
 * @description
 * 
 * 参数为 metaItems, subtitles
 * 先调用 genMetaItems(metaItems)，得到 metaOjb 对象如：{"AAAA.": "aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa.", ....}
 * 
 * 接下来与genTestDataFile中的逻辑类似，不同点在于 pickItems 时的 resolveIndex 逻辑：defaultItem 为 metaItems[index]
*/

const genTestDataFileForEnglish = (metaItems: string[], subtitles: Picks[]) => {
    // 生成 metaObj，将原始字符串映射到转换后的文本
    const metaObj = genMetaItems(metaItems)
    
    // 辅助函数：根据索引从 metaItems 获取原始字符串，然后从 metaObj 获取转换后的文本
    const resolveMetaIndex = (index: number): string => {
        if (!Number.isInteger(index)) {
            throw new TypeError(`字幕索引必须为整数，但收到 ${index}`)
        }
        // 索引从1开始，转换为数组索引（从0开始）
        const arrayIndex = index - 1
        if (arrayIndex < 0 || arrayIndex >= metaItems.length) {
            throw new RangeError(`字幕索引 ${index} 超出范围，允许的范围为 1-${metaItems.length}`)
        }
        const originalItem = metaItems[arrayIndex]
        return metaObj[originalItem]
    }
    
    // 类似 pickItems，但使用 metaItems 和 metaObj
    const pickItemsForEnglish = (items: Picks): subtitle_item[] => {
        if (!Array.isArray(items) || items.length === 0) {
            const defaultText = resolveMetaIndex(DEFAULT_SUBTITLE_INDEX + 1)
            return [{
                tStartMs: 0,
                dDurationMs: 4000,
                segs: [{
                    utf8: defaultText
                }]
            }]
        }

        return items.map((itemIndex, idx) => {
            const text = resolveMetaIndex(Number(itemIndex))
            const tStartMs = idx * 5000

            return {
                tStartMs,
                dDurationMs: 4000,
                segs: [{
                    utf8: text
                }]
            }
        })
    }
    
    // 与 genTestDataFile 类似的逻辑
    const resolvedSubtitles = Array.isArray(subtitles) ? subtitles : []
    const rst: Record<string, subtitle_item[]> = {}

    resolvedSubtitles.forEach((pick) => {
        const normalizedPick = Array.isArray(pick) ? pick : []
        const key = normalizedPick.length > 0
            ? normalizedPick.map((item) => Number(item)).join('-')
            : 'default'
        rst[key] = pickItemsForEnglish(normalizedPick)
    })

    const outputFilePath = join(process.cwd(), 'test', 'TestDataForEnglish.json')
    mkdirSync(dirname(outputFilePath), { recursive: true })
    writeFileSync(outputFilePath, JSON.stringify(rst, null, 2), { encoding: 'utf-8' })
    return outputFilePath
}

const metaItems = [
  "AAAA.",
  "BBBB, ",
  "CC. CC",
  "DD, DD",
  ". EEEE",
  ", FFFF",
  "G, G, GG",
  "HHH, H, ",
  "I.I, II",
  "JJJ. J,",
  ", K, KK, K",
  "LL. L, L,",
  ". M. MMM",
  "N, NN. N,"
]

export const subtitles = [
    [1,2,3,4],
    [2,3,4,5],
    [6,7,8,9],
    [10,11,12,13],
]


// genTestDataFile(subtitles)

genTestDataFileForEnglish(metaItems, subtitles)
