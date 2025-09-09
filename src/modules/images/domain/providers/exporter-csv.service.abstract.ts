import { Image } from '../entities/image.entity';

export abstract class ExporterCsvService {
  abstract export(images: Image[]): Promise<string>;
}
