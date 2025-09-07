import { ImageMimeType } from '../../domain/entities/image-mimetype.enum';
import { Image } from '../../domain/entities/image.entity';

export type DynamoImage = {
  id: string;
  userId: string;
  originalName: string;
  mimetype: ImageMimeType;
  key: string;
  size: number;
  url: string;
  uploadedAt: string;
};

export class DynamoImageMapper {
  static toDomain(image: DynamoImage): Image {
    return new Image(
      image.id,
      image.userId,
      image.originalName,
      image.mimetype,
      image.key,
      image.size,
      image.url,
      new Date(image.uploadedAt),
    );
  }

  static toPersistence(image: Image): DynamoImage {
    return {
      id: image.getId(),
      userId: image.getUserId(),
      originalName: image.getOriginalName(),
      mimetype: image.getMimeType(),
      key: image.getKey()!,
      size: image.getSize()!,
      url: image.getUrl()!,
      uploadedAt: image.getUploadedAt().toISOString(),
    };
  }
}
