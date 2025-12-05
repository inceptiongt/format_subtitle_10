# Rslib project

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```

## 获得字幕相关 json 文件——yt-dlp

使用命令： 
```
yt-dlp URL --skip-download --write-info-json --sub-langs 'en,zh-Hans-en' --sub-format json3 --write-subs --write-auto-subs -o '%(fulltitle)s - %(channel)s - %(upload_date)s'
```

- `--skip-download`: 跳过视频下载，只下载字幕和元数据
- `--write-info-json`: 下载视频的元数据并保存为 JSON 文件，info.json
- `--sub-langs 'en,zh-Hans-en'`: 指定要下载的字幕语言，这里下载英语、从英文自动翻译成的中文字幕
- `--sub-format json3`: 指定字幕格式为 JSON3 格式
- `--write-subs`: 下载视频的字幕，保存为文件
- `--write-auto-subs`: 下载自动生成的字幕，保存为文件
- `-o '%(fulltitle)s - %(channel)s - %(upload_date)s'`: 设置输出文件名格式，使用视频标题+频道名称+上传时间

info.json 字段说明：
- formats 字段，表示提供的音视频格式。
- subtitles 字段，表示原生字幕。为空则该视频没有提供原生字幕，只有自动生成的字幕。
- automatic_captions 字段，表示自动生成的字幕。与原生字幕的区别：内容不是长字符，而是短字符组成的数组；英文没有标点符号。
- 上述音视频格式信息可以通过命令查看：`yd-dlp -F`; 字幕信息可以通过命令查看：`yt-dlp --list-subs`


## 待优化
### \n 占用的时间
来源：How Africa’s Geography Traps it in Endless Poverty - RealLifeLore - 20241123.zh-Hans-en.json
描述：output 中第一个dDurationMs超长，第二三句dDurationMs超短

input json
```
{
      "tStartMs": 1024029,
      "dDurationMs": 2211,
      "wWinId": 1,
      "aAppend": 1,
      "segs": [
        {
          "utf8": "\n"
        }
      ]
    },
    {
      "tStartMs": 1026230,
      "dDurationMs": 2130,
      "wWinId": 1,
      "aAppend": 1,
      "segs": [
        {
          "utf8": "\n"
        }
      ]
    },
    {
      "tStartMs": 1028350,
      "dDurationMs": 2609,
      "wWinId": 1,
      "aAppend": 1,
      "segs": [
        {
          "utf8": "\n"
        }
      ]
    },
    {
      "tStartMs": 1030949,
      "dDurationMs": 2370,
      "wWinId": 1,
      "aAppend": 1,
      "segs": [
        {
          "utf8": "\n"
        }
      ]
    },
    {
      "tStartMs": 1033309,
      "dDurationMs": 2730,
      "wWinId": 1,
      "aAppend": 1,
      "segs": [
        {
          "utf8": "\n"
        }
      ]
    },
    {
      "tStartMs": 1033319,
      "dDurationMs": 5240,
      "wWinId": 1,
      "segs": [
        {
          "utf8": "非洲",
          "acAsrConf": 0
        },
        {
          "utf8": "大陆",
          "tOffsetMs": 78,
          "acAsrConf": 0
        },
        {
          "utf8": "利用",
          "tOffsetMs": 156,
          "acAsrConf": 0
        },
        {
          "utf8": "河流",
          "tOffsetMs": 234,
          "acAsrConf": 0
        },
        {
          "utf8": "连接",
          "tOffsetMs": 312,
          "acAsrConf": 0
        },
        {
          "utf8": "内陆",
          "tOffsetMs": 390,
          "acAsrConf": 0
        },
        {
          "utf8": "与",
          "tOffsetMs": 468,
          "acAsrConf": 0
        },
        {
          "utf8": "外部",
          "tOffsetMs": 546,
          "acAsrConf": 0
        },
        {
          "utf8": "世界",
          "tOffsetMs": 624,
          "acAsrConf": 0
        },
        {
          "utf8": "进行",
          "tOffsetMs": 702,
          "acAsrConf": 0
        },
        {
          "utf8": "贸易",
          "tOffsetMs": 780,
          "acAsrConf": 0
        },
        {
          "utf8": "，",
          "tOffsetMs": 858,
          "acAsrConf": 0
        },
        {
          "utf8": "这",
          "tOffsetMs": 936,
          "acAsrConf": 0
        },
        {
          "utf8": "本身",
          "tOffsetMs": 1014,
          "acAsrConf": 0
        },
        {
          "utf8": "就",
          "tOffsetMs": 1092,
          "acAsrConf": 0
        },
        {
          "utf8": "具有",
          "tOffsetMs": 1170,
          "acAsrConf": 0
        },
        {
          "utf8": "天然",
          "tOffsetMs": 1248,
          "acAsrConf": 0
        },
        {
          "utf8": "的",
          "tOffsetMs": 1326,
          "acAsrConf": 0
        },
        {
          "utf8": "地理",
          "tOffsetMs": 1404,
          "acAsrConf": 0
        },
        {
          "utf8": "优势",
          "tOffsetMs": 1482,
          "acAsrConf": 0
        },
        {
          "utf8": "。",
          "tOffsetMs": 1560,
          "acAsrConf": 0
        },
        {
          "utf8": "整个",
          "tOffsetMs": 1638,
          "acAsrConf": 0
        },
        {
          "utf8": "非洲",
          "tOffsetMs": 1716,
          "acAsrConf": 0
        },
        {
          "utf8": "大陆",
          "tOffsetMs": 1794,
          "acAsrConf": 0
        },
        {
          "utf8": "唯一",
          "tOffsetMs": 1872,
          "acAsrConf": 0
        },
        {
          "utf8": "的",
          "tOffsetMs": 1950,
          "acAsrConf": 0
        },
        {
          "utf8": "例外",
          "tOffsetMs": 2028,
          "acAsrConf": 0
        },
        {
          "utf8": "是",
          "tOffsetMs": 2106,
          "acAsrConf": 0
        },
        {
          "utf8": "尼罗河",
          "tOffsetMs": 2184,
          "acAsrConf": 0
        },
        {
          "utf8": "，",
          "tOffsetMs": 2262,
          "acAsrConf": 0
        },
        {
          "utf8": "但",
          "tOffsetMs": 2340,
          "acAsrConf": 0
        },
        {
          "utf8": "即使",
          "tOffsetMs": 2418,
          "acAsrConf": 0
        },
        {
          "utf8": "是",
          "tOffsetMs": 2496,
          "acAsrConf": 0
        }
      ]
    },

```

output
```
{
    "tStartMs": 1024029,
    "dDurationMs": 10271,
    "segs": [
      {
        "utf8": "非洲大陆利用河流连接内陆与外部世界进行贸易"
      }
    ]
  },
  {
    "tStartMs": 1034300,
    "dDurationMs": 624,
    "segs": [
      {
        "utf8": "这本身就具有天然的地理优势。"
      }
    ]
  },
  {
    "tStartMs": 1034924,
    "dDurationMs": 713,
    "segs": [
      {
        "utf8": "整个非洲大陆唯一的例外是尼罗河"
      }
    ]
  }
```