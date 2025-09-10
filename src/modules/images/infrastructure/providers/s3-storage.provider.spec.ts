import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { S3StorageProvider } from './s3-storage.provider';

describe('S3StorageProvider', () => {
  let s3StorageProvider: S3StorageProvider;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [S3StorageProvider, ConfigService],
    })
      .useMocker((token) => {
        if (token === ConfigService) {
          return { get: 'users-table' };
        }

        if (typeof token === 'function') {
          return jest.fn();
        }
      })
      .compile();

    s3StorageProvider = moduleRef.get(S3StorageProvider);
  });

  test('should be defined', () => {
    expect(s3StorageProvider).toBeDefined();
  });
});
