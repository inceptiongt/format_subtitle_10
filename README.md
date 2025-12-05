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
yt-dlp URL --skip-download --write-info-json --sub-langs 'en,zh-Hans-en' --sub-format json3 --write-subs --write-auto-subs -o '%(fulltitle)s - %(channel)s - %(upload_date)s'` 
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
