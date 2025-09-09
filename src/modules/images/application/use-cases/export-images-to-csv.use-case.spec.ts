import { Test, TestingModule } from '@nestjs/testing';
import { ExportImagesToCsvUseCase } from './export-images-to-csv.use-case';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';
import { ExporterCsvService } from '../../domain/providers/exporter-csv.service.abstract';

describe('ExportImagesToCsvUseCase', () => {
  let exportImagesToCsvUseCase: ExportImagesToCsvUseCase;
  let imageRepository: jest.Mocked<ImageRepository>;
  let exporterCsvService: jest.Mocked<ExporterCsvService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ExportImagesToCsvUseCase],
    })
      .useMocker((token) => {
        if (token === ImageRepository) {
          return {
            findAllByUser: jest
              .fn()
              .mockResolvedValue(['image', 'image2', 'image3']),
          };
        }

        if (token === ExporterCsvService) {
          return {
            export: jest.fn(),
          };
        }
      })
      .compile();

    exportImagesToCsvUseCase = moduleRef.get(ExportImagesToCsvUseCase);
    imageRepository = moduleRef.get(ImageRepository);
    exporterCsvService = moduleRef.get(ExporterCsvService);
  });

  test('should be defined', () => {
    expect(exportImagesToCsvUseCase).toBeDefined();
  });

  test('should export images data to csv successfully', async () => {
    await exportImagesToCsvUseCase.execute('user-id');

    expect(imageRepository.findAllByUser).toHaveBeenCalledWith('user-id');
    expect(exporterCsvService.export).toHaveBeenCalledWith([
      'image',
      'image2',
      'image3',
    ]);
  });
});
