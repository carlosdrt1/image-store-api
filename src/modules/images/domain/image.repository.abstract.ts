import { Image } from './image.entity';

export abstract class ImageRepository {
  abstract save(
    image: Image,
    fileStream: NodeJS.ReadableStream,
  ): Promise<Image>;
  abstract findAllByUser(
    userId: string,
    limit: number,
    page: number,
    imageName?: string,
  ): Promise<Image[]>;
}
