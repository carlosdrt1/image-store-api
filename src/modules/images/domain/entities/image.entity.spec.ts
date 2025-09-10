import { ImageMimeType } from './image-mimetype.enum';
import { Image } from './image.entity';

describe('ImageEntity', () => {
  test('should create an image successfully', () => {
    const image = new Image(
      'any-id',
      'user-id',
      'image.jpeg',
      ImageMimeType.JPG,
      'key:dak2',
      112331,
      'http://',
      new Date(),
    );

    expect(image).toBeDefined();
    expect(image.getId()).toBe('any-id');
    expect(image.getUserId()).toBe('user-id');
    expect(image.getOriginalName()).toBe('image.jpeg');
    expect(image.getMimeType()).toBe(ImageMimeType.JPG);
    expect(image.getKey()).toBe('key:dak2');
    expect(image.getSize()).toBe(112331);
    expect(image.getUrl()).toBe('http://');
    expect(image.getUploadedAt()).toBeInstanceOf(Date);
  });

  test('should attatch to storage successfully', () => {
    const image = new Image(
      'any-id',
      'user-id',
      'image.jpeg',
      ImageMimeType.JPG,
    );
    image.toStorage('url', 223132, 'key');

    expect(image).toBeDefined();
    expect(image.getId()).toBe('any-id');
    expect(image.getUserId()).toBe('user-id');
    expect(image.getOriginalName()).toBe('image.jpeg');
    expect(image.getMimeType()).toBe(ImageMimeType.JPG);
    expect(image.getKey()).toBe('key');
    expect(image.getSize()).toBe(223132);
    expect(image.getUrl()).toBe('url');
    expect(image.getUploadedAt()).toBeInstanceOf(Date);
  });

  test('should fail when toStorage pass a invalid size', () => {
    const image = new Image(
      'any-id',
      'user-id',
      'image.jpeg',
      ImageMimeType.JPG,
    );

    expect(() => image.toStorage('url', -2, 'key')).toThrow(Error);
  });
});
