import { Test, TestingModule } from '@nestjs/testing';
import { Argon2HasherService } from './argon2-hasher.service';
import * as argon2 from 'argon2';

describe('Argon2HasherService', () => {
  let hasherService: Argon2HasherService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [Argon2HasherService],
    }).compile();

    hasherService = moduleRef.get(Argon2HasherService);
  });

  test('should be defined', () => {
    expect(hasherService).toBeDefined();
  });

  test('should return a hashed string successfully', async () => {
    const hashSpy = jest
      .spyOn(argon2, 'hash')
      .mockResolvedValue('hashed-some-password');

    const result = await hasherService.hash('some-password');

    expect(result).toBe('hashed-some-password');
    expect(hashSpy).toHaveBeenCalledWith('some-password', {
      type: argon2.argon2id,
    });
  });

  test('should return true when the verification is valid', async () => {
    const verifySpy = jest.spyOn(argon2, 'verify');
    verifySpy.mockResolvedValue(true);

    const result = await hasherService.verify('hashed-string', 'password');

    expect(result).toBe(true);
    expect(verifySpy).toHaveBeenCalledWith('hashed-string', 'password');
  });

  test('should throw an error if password verification fails', async () => {
    const verifySpy = jest.spyOn(argon2, 'verify');
    verifySpy.mockRejectedValue(new Error());

    await expect(
      hasherService.verify('hashed-string', 'password'),
    ).rejects.toThrow(Error);
  });
});
