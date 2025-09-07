import { Test, TestingModule } from '@nestjs/testing';
import { UploadImageUseCase } from './upload-image.use-case';
import { ImageRepository } from '../../domain/image.repository.abstract';
import { ImageInput } from '../dto/image-input.dto';
import { Readable } from 'stream';
import { Image } from '../../domain/image.entity';
import { BadRequestException } from '@nestjs/common';
import { StorageProvider } from '../../domain/providers/storage.provider.abstract';

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
          return { create: jest.fn() };
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
      userId: 'any-id',
      originalName: 'my-image.png',
      mimeType: 'image/png',
      stream: new Readable(),
    };

    await uploadImageUseCase.execute(uploadData);

    expect(imageRepository.create).toHaveBeenCalledWith(
      expect.any(Image),
      uploadData.stream,
    );
  });

  test('should fail if the file is not an image', async () => {
    const uploadData: ImageInput = {
      userId: 'any-id',
      originalName: 'any.exe',
      mimeType: 'application/pdf',
      stream: new Readable(),
    };

    await expect(uploadImageUseCase.execute(uploadData)).rejects.toThrow(
      BadRequestException,
    );
  });
});
