import { Injectable } from '@nestjs/common';
import { ExporterCsvService } from '../../domain/providers/exporter-csv.service.abstract';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';

@Injectable()
export class ExportImagesToCsvUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly exporterCsvService: ExporterCsvService,
  ) {}

  async execute(userId: string): Promise<string> {
    const images = await this.imageRepository.findAllByUser(userId);
    const csv = await this.exporterCsvService.export(images);

    return csv;
  }
}
