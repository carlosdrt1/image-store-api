import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.abstract';
import { User } from '../../domain/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class UserDynamoRepository extends UserRepository {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    super();
    const client = new DynamoDBClient({});
    this.tableName = this.configService.get<string>(
      'DYNAMO_USERS_TABLE',
      'Users',
    );
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async create(data: User): Promise<User> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          id: data.getId(),
          name: data.getName(),
          email: data.getEmail(),
          password: data.getPassword(),
          createdAt: data.getCreatedAt().toISOString(),
          updatedAt: data.getUpdatedAt().toISOString(),
        },
      }),
    );

    return data;
  }

  async existsByEmail(email: string): Promise<boolean> {
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

    return (result.Count ?? 0) > 0;
  }
}
