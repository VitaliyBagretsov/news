import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'node:fs';
import { access, mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { randomUUID } from 'node:crypto';

import type { StoredMediaImage, UploadedMediaImage } from '../types/index.js';

const IMAGE_TYPES = {
  'image/jpeg': { contentType: 'image/jpeg', extension: 'jpg' },
  'image/png': { contentType: 'image/png', extension: 'png' },
  'image/webp': { contentType: 'image/webp', extension: 'webp' },
} as const;

const FILE_NAME_PATTERN = /^\d+-[0-9a-f-]+\.(jpg|png|webp)$/;

const hasValidSignature = (file: UploadedMediaImage): boolean => {
  if (file.mimetype === 'image/png') {
    return file.buffer
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (file.mimetype === 'image/jpeg') {
    return file.buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
  }
  if (file.mimetype === 'image/webp') {
    return (
      file.buffer.subarray(0, 4).toString() === 'RIFF' &&
      file.buffer.subarray(8, 12).toString() === 'WEBP'
    );
  }
  return false;
};

@Injectable()
export class MediaImagesService {
  private readonly directory: string;

  constructor(configService: ConfigService) {
    this.directory = configService.getOrThrow<string>('mediaImages.directory');
  }

  async save(mediaId: number, file: UploadedMediaImage): Promise<string> {
    const imageType = IMAGE_TYPES[file.mimetype as keyof typeof IMAGE_TYPES];
    if (!imageType || !hasValidSignature(file)) {
      throw new BadRequestException(
        'Only PNG, JPEG and WebP images are supported',
      );
    }

    const fileName = `${mediaId}-${randomUUID()}.${imageType.extension}`;
    await mkdir(this.directory, { recursive: true });
    await writeFile(this.resolvePath(fileName), file.buffer, { flag: 'wx' });

    return fileName;
  }

  async remove(fileName: string | null | undefined): Promise<void> {
    if (!fileName || !FILE_NAME_PATTERN.test(fileName)) return;
    await rm(this.resolvePath(fileName), { force: true });
  }

  async open(fileName: string): Promise<StoredMediaImage> {
    if (!FILE_NAME_PATTERN.test(fileName))
      throw new NotFoundException('Image not found');

    const extension = fileName.split('.').at(-1);
    const contentType =
      extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
    const path = this.resolvePath(fileName);

    try {
      await access(path);
    } catch {
      throw new NotFoundException('Image not found');
    }

    return { contentType, stream: createReadStream(path) };
  }

  private resolvePath(fileName: string): string {
    if (basename(fileName) !== fileName)
      throw new NotFoundException('Image not found');
    return join(this.directory, fileName);
  }
}
