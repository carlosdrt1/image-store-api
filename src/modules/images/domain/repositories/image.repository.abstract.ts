import { Image } from '../entities/image.entity';

export abstract class ImageRepository {
  abstract create(image: Image): Promise<Image>;
  abstract findAllByUserPaginated(
    userId: string,
    limit: number,
    page: number,
    imageName?: string,
  ): Promise<Image[]>;
  abstract findByName(name: string, userId: string): Promise<Image | null>;
  abstract findAllByUser(userId: string): Promise<Image[]>;
  abstract remove(id: string): Promise<void>;
}
