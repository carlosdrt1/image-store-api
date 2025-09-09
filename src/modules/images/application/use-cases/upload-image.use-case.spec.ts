import { Test, TestingModule } from '@nestjs/testing';
import { UploadImageUseCase } from './upload-image.use-case';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';
import { ImageInput } from '../dto/image-input.dto';
import { Readable } from 'stream';
import { Image } from '../../domain/entities/image.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { StorageProvider } from '../../domain/providers/storage.provider.abstract';
import { ImageMimeType } from '../../domain/entities/image-mimetype.enum';

jest.mock('uuid', () => ({
  v7: jest.fn(() => 'any-uuid'),
}));

describe('UploadImageUseCase', () => {
  let uploadImageUseCase: UploadImageUseCase;
  let imageRepository: jest.Mocked<ImageRepository>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UploadImageUseCase],
    })
      .useMocker((token) => {
        if (token === ImageRepository) {
          return { create: jest.fn(), findByName: jest.fn() };
        }
        if (token === StorageProvider) {
          return {
            upload: jest.fn().mockImplementation((image: Image) => image),
          };
        }
      })
      .compile();

    uploadImageUseCase = moduleRef.get(UploadImageUseCase);
    imageRepository = moduleRef.get(ImageRepository);
  });

  test('should be dedfined', () => {
    expect(uploadImageUseCase).toBeDefined();
  });

  test('should upload an image successfully', async () => {
    const uploadData: ImageInput = {
      originalName: 'my-image.png',
      mimeType: 'image/png',
      stream: new Readable(),
    };

    await uploadImageUseCase.execute(uploadData, 'user-id');

    expect(imageRepository.create).toHaveBeenCalledWith(expect.any(Image));
  });

  test('should fail if the file is not an image', async () => {
    const uploadData: ImageInput = {
      originalName: 'any.exe',
      mimeType: 'application/pdf',
      stream: new Readable(),
    };

    await expect(
      uploadImageUseCase.execute(uploadData, 'user-id'),
    ).rejects.toThrow(BadRequestException);
  });

  test('should fail if the filename already exists', async () => {
    imageRepository.findByName.mockResolvedValue(
      new Image('any-id', 'user-id', 'my-image.png', ImageMimeType.JPG),
    );

    const uploadData: ImageInput = {
      originalName: 'my-image.png',
      mimeType: 'image/png',
      stream: new Readable(),
    };

    await expect(
      uploadImageUseCase.execute(uploadData, 'user-id'),
    ).rejects.toThrow(ConflictException);
  });
});
