import { Injectable } from '@nestjs/common';
import { StorageProvider } from '../../domain/providers/storage.provider.abstract';
import { Image } from '../../domain/entities/image.entity';
import { measureStream } from '../utils/measure-stream.util';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3StorageProvider extends StorageProvider {
  private readonly clientS3: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    super();

    this.clientS3 = new S3Client();
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME')!;
  }

  async upload(image: Image, fileStream: Readable): Promise<Image> {
    const extension = image.getOriginalName().split('.').pop();
    const key = `public/${image.getId()}.${extension}`;

    const { stream, getSize } = measureStream(fileStream);

    const upload = new Upload({
      client: this.clientS3,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: stream,
        ContentType: image.getMimeType(),
      },
    });

    const done = await upload.done();

    image.setSize(getSize());
    image.setUrl(done.Location!);
    image.setKey(key);

    return image;
  }
}
