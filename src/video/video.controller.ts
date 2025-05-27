import {
  Controller,
  Get,
  Header,
  Headers,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('stream/:id')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  getVideoStream(
    @Param('id') id: string,
    @Headers() headers: { range: string },
    @Res() res: Response,
  ) {
    const videoPath = `assets/${id}.mp4`;

    const { size } = statSync(videoPath);

    const videoRange = headers.range;
    console.log({ videoRange, size, videoPath });
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;

      const readStreamFile = createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 60,
      });
      console.log({ readStreamFile });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
      readStreamFile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head); //200
      createReadStream(videoPath).pipe(res);
    }
  }
}
