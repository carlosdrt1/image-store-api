import { Module } from '@nestjs/common';
import { ImagesController } from './adapters/controllers/images.controller';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';
import { ImageRepository } from './domain/repositories/image.repository.abstract';
import { S3DynamoImageRepository } from './infrastructure/repositories/s3-dynamo-image.repository';
import { AuthModule } from '../auth/auth.module';
import { FindImagesUseCase } from './application/use-cases/find-images.use-case';
import { S3StorageProvider } from './infrastructure/providers/s3-storage.provider';
import { StorageProvider } from './domain/providers/storage.provider.abstract';

@Module({
  imports: [AuthModule],
  controllers: [ImagesController],
  providers: [
    UploadImageUseCase,
    FindImagesUseCase,
    { provide: ImageRepository, useClass: S3DynamoImageRepository },
    { provide: StorageProvider, useClass: S3StorageProvider },
  ],
})
export class ImagesModule {}
