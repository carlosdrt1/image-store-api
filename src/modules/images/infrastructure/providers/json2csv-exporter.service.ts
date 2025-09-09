import { Injectable } from '@nestjs/common';
import { ExporterCsvService } from '../../domain/providers/exporter-csv.service.abstract';
import { Image } from '../../domain/entities/image.entity';
import { AsyncParser } from '@json2csv/node';

@Injectable()
export class Json2CsvExporterService implements ExporterCsvService {
  async export(images: Image[]): Promise<string> {
    const plainImages = images.map((image) => this.imageToPlain(image));

    const parser = new AsyncParser({
      fields: ['name', 'url', 'size', 'uploadedAt'],
    });
    const csv = await parser.parse(plainImages).promise();

    return csv;
  }

  private imageToPlain(image: Image) {
    return {
      name: image.getOriginalName(),
      url: image.getUrl(),
      size: image.getSize(),
      uploadedAt: image.getUploadedAt(),
    };
  }
}
