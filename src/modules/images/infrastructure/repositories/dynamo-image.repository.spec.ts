import { Test, TestingModule } from '@nestjs/testing';
import { DynamoImageRepository } from './dynamo-image.repository';
import { ConfigService } from '@nestjs/config';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { imageFactory } from 'test/factories/image.factory';

describe('DynamoImageRepository', () => {
  let dynamoImageRepository: DynamoImageRepository;
  const sendMock = jest.fn();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [DynamoImageRepository, ConfigService],
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

    dynamoImageRepository = moduleRef.get(DynamoImageRepository);
  });

  test('should be defined', () => {
    expect(dynamoImageRepository).toBeDefined();
  });

  test('should send a query command and return paginated image data', async () => {
    sendMock.mockResolvedValue({});

    await dynamoImageRepository.findAllByUserPaginated('any-id', 10, 1);

    expect(sendMock).toHaveBeenCalledWith(expect.any(QueryCommand));
  });

  test('should send a query command to return a image by name', async () => {
    sendMock.mockResolvedValue({});

    await dynamoImageRepository.findByName('image.jpg', 'any-id');

    expect(sendMock).toHaveBeenCalledWith(expect.any(QueryCommand));
  });

  test('should send a put command to create an new image in database', async () => {
    await dynamoImageRepository.create(imageFactory());

    expect(sendMock).toHaveBeenCalledWith(expect.any(PutCommand));
  });

  test('should send a query command all image data', async () => {
    await dynamoImageRepository.findAllByUserPaginated('any-id', 10, 1);

    expect(sendMock).toHaveBeenCalledWith(expect.any(QueryCommand));
  });

  test('should send a delete command and remove image data frfom db', async () => {
    await dynamoImageRepository.remove('any-id');

    expect(sendMock).toHaveBeenCalledWith(expect.any(DeleteCommand));
  });
});
