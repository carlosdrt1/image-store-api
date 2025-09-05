import { Readable } from 'stream';

export interface ImageInput {
  userId: string;
  originalName: string;
  mimeType: string;
  stream: Readable;
}
