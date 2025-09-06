import { DynamoImage, DynamoImageMapper } from './image-dynamo.mapper';
import { ImageMimeType } from '../../domain/image-mimetype.enum';

describe('DynamoImageMapper', () => {
  const dynamoImage: DynamoImage = {
    id: 'any-id',
    userId: 'any-id',
    originalName: 'photo.png',
    mimetype: ImageMimeType.PNG,
    key: 'bucket/photo.png',
    size: 1024,
    url: 'http:/url-photo.jpg',
    uploadedAt: '2001-01-01T12:00:00.000Z',
  };

  test('should map DynamoImage to domain Image', () => {
    const image = DynamoImageMapper.toDomain(dynamoImage);

    expect(image.getId()).toBe(dynamoImage.id);
    expect(image.getUploadedAt()).toEqual(new Date(dynamoImage.uploadedAt));
  });

  test('should map domain Image to DynamoImage', () => {
    const image = DynamoImageMapper.toDomain(dynamoImage);
    const persistence = DynamoImageMapper.toPersistence(image);

    expect(persistence).toEqual(dynamoImage);
  });
});
