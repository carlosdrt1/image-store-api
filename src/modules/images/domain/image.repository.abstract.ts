import { Image } from './image.entity';

export abstract class ImageRepository {
  abstract create(image: Image): Promise<Image>;
  abstract findAllByUser(
    userId: string,
    limit: number,
    page: number,
    imageName?: string,
  ): Promise<Image[]>;
}
