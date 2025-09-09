import { Readable } from 'stream';

export interface ImageInput {
  originalName: string;
  mimeType: string;
  stream: Readable;
}
