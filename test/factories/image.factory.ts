import { faker } from '@faker-js/faker/.';
import { ImageMimeType } from 'src/modules/images/domain/entities/image-mimetype.enum';
import { Image } from 'src/modules/images/domain/entities/image.entity';

export const imageFactory = (override?: {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}): Image => {
  const imageData = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    originalName: `${faker.system.commonFileName('jpg')}`,
    mimetype: ImageMimeType.JPG,
    key: faker.string.uuid(),
    size: faker.number.int(),
    url: faker.internet.url(),
    uploadedAt: faker.date.recent(),
    ...override,
  };

  return new Image(
    imageData.id,
    imageData.userId,
    imageData.originalName,
    imageData.mimetype,
    imageData.key,
    imageData.size,
    imageData.url,
    imageData.uploadedAt,
  );
};
