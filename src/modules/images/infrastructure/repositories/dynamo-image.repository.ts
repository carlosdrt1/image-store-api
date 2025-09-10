import {
  DeleteCommand,
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
export class DynamoImageRepository extends ImageRepository {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    super();
    this.docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
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

  async findAllByUserPaginated(
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

  async findByName(name: string, userId: string): Promise<Image | null> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'userId-originalName-index',
        KeyConditionExpression:
          'userId = :userId AND originalName = :originalName',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':originalName': name,
        },
        Limit: 1,
      }),
    );

    if (!result.Items || result.Items?.length === 0) return null;

    const image = result.Items[0] as DynamoImage;
    return DynamoImageMapper.toDomain(image);
  }

  async remove(id: string) {
    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      }),
    );
  }

  async findAllByUser(userId: string): Promise<Image[]> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'userId-originalName-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      }),
    );

    if (!result.Items) return [];

    const images = result.Items?.map((image: DynamoImage) =>
      DynamoImageMapper.toDomain(image),
    );

    return images;
  }
}
