import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.abstract';
import { User } from '../../domain/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoUser, DynamoUserMapper } from '../mappers/dynamo-user.mapper';

@Injectable()
export class DynamoUserRepository extends UserRepository {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    super();
    this.tableName = this.configService.get<string>(
      'DYNAMO_USERS_TABLE',
      'Users',
    );
    this.docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async create(data: User): Promise<User> {
    const userDynamo = DynamoUserMapper.toPersistence(data);

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: userDynamo,
      }),
    );

    return data;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
        Limit: 1,
      }),
    );
    if (!result.Items || result.Items?.length === 0) return null;

    const user = result.Items[0] as DynamoUser;
    return DynamoUserMapper.toDomain(user);
  }
}
