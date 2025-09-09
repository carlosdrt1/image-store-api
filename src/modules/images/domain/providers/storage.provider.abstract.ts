import { Readable } from 'stream';
import { Image } from '../entities/image.entity';

export abstract class StorageProvider {
  abstract upload(image: Image, fileStream: Readable): Promise<Image>;
  abstract remove(key: string): Promise<void>;
}
