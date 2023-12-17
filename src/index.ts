import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

// Function to download a single video
async function downloadVideoById(videoId: string, outputPath?: string) {
  const videoInfo = await ytdl.getInfo(videoId);
  const videoTitle = videoInfo.videoDetails.title.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
  const audioReadableStream = ytdl(videoId, { filter: 'audioonly' });

  const outputDir = outputPath ? `${outputPath}/${videoTitle}` : videoTitle;
  const filePath = `${outputDir}.mp3`;

  if (outputPath && !fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  audioReadableStream.on('progress', (_, downloaded, total) => {
    const percent = (downloaded / total) * 100;
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Downloading ${videoTitle}: ${percent.toFixed(2)}%`);
  });

  audioReadableStream.on('finish', () => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `Download of video "${videoId}" (${videoTitle}) completed!\n`
    );
  });

  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(audioReadableStream)
      .audioCodec('libmp3lame')
      .on('end', resolve)
      .on('error', reject)
      .save(filePath);
  });
}

// Function to scrape a playlist by ID and download all videos
async function downloadPlaylistById(playlistId: string, outputPath?: string) {
  const playlist = await ytpl(playlistId);
  for (const video of playlist.items) {
    await downloadVideoById(video.id, outputPath);
  }
}

function parseArguments(args: string[]) {
  const parsedArgs: { command?: string; id?: string; outputPath?: string } = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--video':
        parsedArgs.command = 'video';
        parsedArgs.id = args[i + 1];
        i++;
        break;
      case '--playlist':
        parsedArgs.command = 'playlist';
        parsedArgs.id = args[i + 1];
        i++;
        break;
      case '--output':
        parsedArgs.outputPath = args[i + 1];
        i++;
        break;
      default:
        break;
    }
  }
  return parsedArgs;
}

async function main() {
  const args = process.argv.slice(2);
  console.clear();

  if (args.length < 2) {
    console.log('Usage: pnpm start <command> <video_id/playlist_id>');
    return;
  }

  const { command, id, outputPath } = parseArguments(args);

  if (!command || !id) {
    console.error(
      'Invalid command! Please specify a valid command (--video or --playlist) along with an ID.'
    );
    return;
  }

  switch (command) {
    case 'video':
      await downloadVideoById(id, outputPath);
      break;
    case 'playlist':
      await downloadPlaylistById(id, outputPath);
      break;
    default:
      console.log('Invalid command! Please use "--video" or "--playlist".');
      break;
  }
}

main();
