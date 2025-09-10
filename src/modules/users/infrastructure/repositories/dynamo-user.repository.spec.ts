import { Test, TestingModule } from '@nestjs/testing';
import { DynamoUserRepository } from './dynamo-user.repository';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { userFactory } from 'test/factories/user.factory';

describe('DynamoUserRepository', () => {
  let dynamoUserRepository: DynamoUserRepository;
  const sendMock = jest.fn();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [DynamoUserRepository, ConfigService],
    })
      .useMocker((token) => {
        if (token === DynamoDBDocumentClient) {
          return { send: sendMock, from: jest.fn() };
        }

        if (token === ConfigService) {
          return { get: jest.fn().mockReturnValue('image-table') };
        }

        if (typeof token === 'function') {
          return jest.fn();
        }
      })
      .compile();

    dynamoUserRepository = moduleRef.get(DynamoUserRepository);
  });

  test('should be defined', () => {
    expect(dynamoUserRepository).toBeDefined();
  });

  test('should send a put command to create a new user', async () => {
    await dynamoUserRepository.create(userFactory());

    expect(sendMock).toHaveBeenCalledWith(expect.any(PutCommand));
  });

  test('should send a query command to find a user by email', async () => {
    sendMock.mockResolvedValue({ result: { Items: undefined } });

    await dynamoUserRepository.findByEmail('email@email.com');

    expect(sendMock).toHaveBeenCalledWith(expect.any(QueryCommand));
  });
});
