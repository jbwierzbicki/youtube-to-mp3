# YouTube Downloader with TypeScript

This script allows you to download individual YouTube videos or entire playlists and convert them to MP3 format using TypeScript. It utilizes `ytdl-core` for downloading videos, `ytpl` for handling playlists, and `fluent-ffmpeg` for conversion to MP3.

## Prerequisites

- Node.js installed on your machine or use fnm/nvm.
- pnpm or yarn to manage dependencies.
- TypeScript compiler (`typescript`) installed globally or available as a dev dependency.

## Installation

1. Clone this repository.
2. Install dependencies using pnpm or yarn:

   ```bash
   pnpm install
   ```

   or

   ```bash
   yarn install
   ```

## Usage

Run the script using `pnpm` | `yarn`:

```bash
pnpm download --video <video_id> --output <output_folder>
```

Replace <video_id> or <playlist_id> with the respective YouTube video ID or playlist ID you want to download. Use --output followed by the desired output folder path where the downloaded files will be saved.

> ##### Available Commands:

```bash
--video <video_id>: Downloads a single video by its ID.
--playlist <playlist_id>: Downloads all videos from a playlist by its ID.
--output <output_folder>: Specifies the output folder to save the downloaded files.

```

## Examples:

To download a single video:

```bash
pnpm download --video <video_id> --output ./downloads
```

To download a playlist:

```bash
pnpm download --playlist <playlist_id> --output ./downloads
```
