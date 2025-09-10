import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { UploadImageUseCase } from '../../application/use-cases/upload-image.use-case';
import { FindImagesUseCase } from '../../application/use-cases/find-images.use-case';
import { RemoveImageUseCase } from '../../application/use-cases/remove-image.use-case';
import { ExportImagesToCsvUseCase } from '../../application/use-cases/export-images-to-csv.use-case';
import { BadRequestException } from '@nestjs/common';
import { requestAuthFactory } from 'test/factories/request-auth.factory';
import { Readable } from 'stream';
import { imageFactory } from 'test/factories/image.factory';
import { FastifyReply } from 'fastify';

describe('ImagesController', () => {
  let imagesController: ImagesController;
  let uploadImageUseCase: jest.Mocked<UploadImageUseCase>;
  let findImagesUseCase: jest.Mocked<FindImagesUseCase>;
  let removeImageUseCase: jest.Mocked<RemoveImageUseCase>;
  let exportImagesToCsvUseCase: jest.Mocked<ExportImagesToCsvUseCase>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          return { execute: jest.fn() };
        }
      })
      .compile();

    imagesController = moduleRef.get(ImagesController);
    uploadImageUseCase = moduleRef.get(UploadImageUseCase);
    findImagesUseCase = moduleRef.get(FindImagesUseCase);
    removeImageUseCase = moduleRef.get(RemoveImageUseCase);
    exportImagesToCsvUseCase = moduleRef.get(ExportImagesToCsvUseCase);
  });

  test('should be defined', () => {
    expect(imagesController).toBeDefined();
  });

  describe('upload image', () => {
    test('should upload a file successfully', async () => {
      const fileData = {
        filename: 'image.jpg',
        mimetype: 'image/jpeg',
        file: new Readable(),
      };

      const req = requestAuthFactory({
        file: jest.fn().mockResolvedValue(fileData),
      });

      const createdImage = imageFactory();
      uploadImageUseCase.execute.mockResolvedValue(createdImage);

      await imagesController.uploadImage(req);

      expect(uploadImageUseCase.execute).toHaveBeenCalledWith(
        {
          originalName: fileData.filename,
          mimeType: fileData.mimetype,
          stream: fileData.file,
        },
        'any-id',
      );
    });

    test('should fail if has no file', async () => {
      const req = requestAuthFactory({
        file: jest.fn().mockResolvedValue(undefined),
      });

      await expect(imagesController.uploadImage(req)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  test('should call findAll and return images paginated', async () => {
    const query = { page: 1, limit: 2 };
    const req = requestAuthFactory();
    await imagesController.findAll(query, req);

    expect(findImagesUseCase.execute).toHaveBeenCalledWith(query, req.user.id);
  });

  test('should call exportImagesToCsv and return a csv file for download', async () => {
    const req = requestAuthFactory();
    const reply = {
      header: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    exportImagesToCsvUseCase.execute.mockResolvedValue('some,random,csv');

    await imagesController.exportToCsv(req, reply as unknown as FastifyReply);

    expect(reply.header).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(reply.send).toHaveBeenCalledWith('some,random,csv');
  });

  test('should call remove with the image name passed', async () => {
    const req = requestAuthFactory();

    await imagesController.remove('image.jpg', req);

    expect(removeImageUseCase.execute).toHaveBeenCalledWith(
      'image.jpg',
      req.user.id,
    );
  });
});
