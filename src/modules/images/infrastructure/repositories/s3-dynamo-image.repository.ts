import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { ImageRepository } from '../../domain/repositories/image.repository.abstract';
import { Image } from '../../domain/entities/image.entity';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoImage, DynamoImageMapper } from '../mappers/image-dynamo.mapper';

@Injectable()
export class S3DynamoImageRepository extends ImageRepository {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    super();
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = this.configService.get<string>('DYNAMO_IMAGES_TABLE')!;
  }

  async create(image: Image): Promise<Image> {
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
