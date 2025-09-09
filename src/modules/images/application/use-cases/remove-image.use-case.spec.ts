import { Test, TestingModule } from '@nestjs/testing';
import { RemoveImageUseCase } from './remove-image.use-case';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';
import { StorageProvider } from '../../domain/providers/storage.provider.abstract';
import { Image } from '../../domain/entities/image.entity';
import { ImageMimeType } from '../../domain/entities/image-mimetype.enum';
import { NotFoundException } from '@nestjs/common';

describe('RemoveImageUseCase', () => {
  let removeImageUseCase: RemoveImageUseCase;
  let imageRepository: jest.Mocked<ImageRepository>;
  let storageProvider: jest.Mocked<StorageProvider>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [RemoveImageUseCase],
    })
      .useMocker((token) => {
        if (token === ImageRepository) {
          return { remove: jest.fn(), findByName: jest.fn() };
        }

        if (token === StorageProvider) {
          return { remove: jest.fn() };
        }
      })
      .compile();

    removeImageUseCase = moduleRef.get(RemoveImageUseCase);
    imageRepository = moduleRef.get(ImageRepository);
    storageProvider = moduleRef.get(StorageProvider);
  });

  test('should be defined', () => {
    expect(removeImageUseCase).toBeDefined();
  });

  test('should remove an image successfully', async () => {
    const image = new Image(
      'image-id',
      'user-id',
      'image.jpg',
      ImageMimeType.JPG,
    );
    imageRepository.findByName.mockResolvedValue(image);

    const result = await removeImageUseCase.execute('image.jpg', 'user-id');

    expect(result).toBe(undefined);
    expect(imageRepository.findByName).toHaveBeenCalledWith(
      'image.jpg',
      'user-id',
    );
    expect(imageRepository.remove).toHaveBeenLastCalledWith(image.getId());
    expect(storageProvider.remove).toHaveBeenLastCalledWith(image.getKey());
  });

  test('should fail if the image do not exist', async () => {
    imageRepository.findByName.mockResolvedValue(null);

    await expect(
      removeImageUseCase.execute('image-id', 'user-id'),
    ).rejects.toThrow(NotFoundException);
  });
});
