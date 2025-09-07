import { Readable } from 'stream';
import { Image } from '../image.entity';

export abstract class StorageProvider {
  abstract upload(image: Image, fileStream: Readable): Promise<Image>;
}
