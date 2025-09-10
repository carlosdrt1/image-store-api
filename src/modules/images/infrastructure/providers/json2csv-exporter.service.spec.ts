import { imageFactory } from 'test/factories/image.factory';
import { Json2CsvExporterService } from './json2csv-exporter.service';

describe('Json2CsvExporterService', () => {
  const json2CsvExporterService = new Json2CsvExporterService();

  test('should export images to csv successfully', async () => {
    const images = [imageFactory(), imageFactory()];

    const csv = await json2CsvExporterService.export(images);

    expect(csv).toBeDefined();
  });
});
