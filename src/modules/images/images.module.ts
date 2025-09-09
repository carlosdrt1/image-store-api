import { Module } from '@nestjs/common';
import { ImagesController } from './adapters/controllers/images.controller';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';
import { ImageRepository } from './domain/repositories/image.repository.abstract';
import { DynamoImageRepository } from './infrastructure/repositories/dynamo-image.repository';
import { AuthModule } from '../auth/auth.module';
import { FindImagesUseCase } from './application/use-cases/find-images.use-case';
import { S3StorageProvider } from './infrastructure/providers/s3-storage.provider';
import { StorageProvider } from './domain/providers/storage.provider.abstract';
import { RemoveImageUseCase } from './application/use-cases/remove-image.use-case';
import { ExportImagesToCsvUseCase } from './application/use-cases/export-images-to-csv.use-case';
import { Json2CsvExporterService } from './infrastructure/providers/json2csv-exporter.service';
import { ExporterCsvService } from './domain/providers/exporter-csv.service.abstract';

@Module({
  imports: [AuthModule],
  controllers: [ImagesController],
  providers: [
    UploadImageUseCase,
    FindImagesUseCase,
    RemoveImageUseCase,
    ExportImagesToCsvUseCase,
    { provide: ImageRepository, useClass: DynamoImageRepository },
    { provide: StorageProvider, useClass: S3StorageProvider },
    { provide: ExporterCsvService, useClass: Json2CsvExporterService },
  ],
})
export class ImagesModule {}
