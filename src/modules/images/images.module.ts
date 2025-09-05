import { Module } from '@nestjs/common';
import { ImagesController } from './adapters/controllers/images.controller';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';
import { ImageRepository } from './domain/image.repository.abstract';
import { S3DynamoImageRepository } from './infrastructure/repositories/s3-dynamo-image.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ImagesController],
  providers: [
    UploadImageUseCase,
    { provide: ImageRepository, useClass: S3DynamoImageRepository },
  ],
})
export class ImagesModule {}
