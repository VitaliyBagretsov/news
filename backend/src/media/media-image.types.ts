export interface UploadedMediaImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface StoredMediaImage {
  contentType: string;
  stream: Readable;
}
import type { Readable } from 'node:stream';
