import { S3Client } from '@aws-sdk/client-s3';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { ImageRepository } from '../../domain/image.repository.abstract';
import { Image } from '../../domain/image.entity';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { Upload } from '@aws-sdk/lib-storage';
import { measureStream } from '../utils/measure-stream.util';
import { DynamoImage, DynamoImageMapper } from '../mappers/image-dynamo.mapper';

@Injectable()
export class S3DynamoImageRepository extends ImageRepository {
  private readonly tableName: string;
  private readonly bucketName: string;
  private readonly docClient: DynamoDBDocumentClient;
  private readonly clientS3: S3Client;

  constructor(private readonly configService: ConfigService) {
    super();
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.clientS3 = new S3Client();

    this.tableName = this.configService.get<string>('DYNAMO_IMAGES_TABLE')!;
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME')!;
  }

  async save(image: Image, fileStream: Readable): Promise<Image> {
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

    const dynamoImage = DynamoImageMapper.toPersistence(image);

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: dynamoImage,
      }),
    );

    return image;
  }

  async findAllByUser(
    userId: string,
    limit: number,
    page: number,
    imageName?: string,
  ): Promise<Image[]> {
    const images: Image[] = [];
    let currentPage = 1;
    let lastKey: Record<string, any> | undefined = undefined;

    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: 'userId-originalName-index',
      Limit: limit,
      ExclusiveStartKey: lastKey,
    };

    if (imageName) {
      params.KeyConditionExpression =
        'userId = :userId AND begins_with(originalName, :name)';
      params.ExpressionAttributeValues = {
        ':userId': userId,
        ':name': imageName,
      };
    } else {
      params.KeyConditionExpression = 'userId = :userId';
      params.ExpressionAttributeValues = {
        ':userId': userId,
      };
    }

    while (currentPage <= page) {
      const result = await this.docClient.send(new QueryCommand(params));
      lastKey = result.LastEvaluatedKey;

      result.Items?.forEach((item: DynamoImage) =>
        images.push(DynamoImageMapper.toDomain(item)),
      );

      if (!lastKey) break;
      currentPage++;
    }

    return images;
  }
}
