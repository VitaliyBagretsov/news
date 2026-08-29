import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ConfigService } from '@nestjs/config';

import { MediaImagesService } from './index.js';

describe('MediaImagesService', () => {
  let directory: string;
  let service: MediaImagesService;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'news-media-images-'));
    service = new MediaImagesService({
      getOrThrow: () => directory,
    } as unknown as ConfigService);
  });

  afterEach(() => rm(directory, { force: true, recursive: true }));

  it('stores a PNG under a generated media file name', async () => {
    const buffer = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 1]);
    const fileName = await service.save(7, {
      buffer,
      mimetype: 'image/png',
      originalname: 'logo.png',
      size: buffer.length,
    });

    expect(fileName).toMatch(/^7-[0-9a-f-]+\.png$/);
    await expect(readFile(join(directory, fileName))).resolves.toEqual(buffer);
  });

  it('rejects a file whose content does not match its MIME type', async () => {
    await expect(
      service.save(7, {
        buffer: Buffer.from('not an image'),
        mimetype: 'image/png',
        originalname: 'logo.png',
        size: 12,
      }),
    ).rejects.toThrow('Only PNG, JPEG and WebP images are supported');
  });

  it('rejects unsafe file names when opening an image', async () => {
    await expect(service.open('../secret.png')).rejects.toThrow(
      'Image not found',
    );
  });
});
