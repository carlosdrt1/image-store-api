import { Image } from './image.entity';

export abstract class ImageRepository {
  abstract save(
    image: Image,
    fileStream: NodeJS.ReadableStream,
  ): Promise<Image>;
}
