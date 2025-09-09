import { Test, TestingModule } from '@nestjs/testing';
import { FindImagesUseCase } from './find-images.use-case';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';
import { Image } from '../../domain/entities/image.entity';
import { ImageMimeType } from '../../domain/entities/image-mimetype.enum';

describe('FindImagesUseCase', () => {
  let findImagesUseCase: FindImagesUseCase;
  let imageRepository: jest.Mocked<ImageRepository>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [FindImagesUseCase],
    })
      .useMocker((token) => {
        if (token === ImageRepository) {
          return { findAllByUserPaginated: jest.fn() };
        }
      })
      .compile();

    findImagesUseCase = moduleRef.get(FindImagesUseCase);
    imageRepository = moduleRef.get(ImageRepository);
  });

  test('should be defined', () => {
    expect(findImagesUseCase).toBeDefined();
  });

  test('should return images with given pagination and name', async () => {
    const userId = 'any-id';
    const images: Image[] = [
      new Image(
        '1',
        userId,
        'photo.png',
        'image/png' as ImageMimeType,
        'key',
        123,
        'url',
        new Date(),
      ),
    ];

    imageRepository.findAllByUserPaginated.mockResolvedValue(images);

    const result = await findImagesUseCase.execute(
      {
        page: 2,
        limit: 5,
        name: 'photo',
      },
      userId,
    );

    expect(imageRepository.findAllByUserPaginated).toHaveBeenCalledWith(
      userId,
      5,
      2,
      'photo',
    );

    expect(result).toEqual({
      page: 2,
      limit: 5,
      data: images,
    });
  });

  test('should use default page and limit if not provided', async () => {
    const userId = 'any-id';
    const images: Image[] = [];

    imageRepository.findAllByUserPaginated.mockResolvedValue(images);

    const result = await findImagesUseCase.execute({}, userId);

    expect(imageRepository.findAllByUserPaginated).toHaveBeenCalledWith(
      userId,
      10,
      1,
      undefined,
    );

    expect(result).toEqual({
      page: 1,
      limit: 10,
      data: images,
    });
  });
});
