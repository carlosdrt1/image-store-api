import { Test } from '@nestjs/testing';
import { Argon2Hasher } from './argon2-hasher';
import * as argon2 from 'argon2';

describe('Argon2Hasher', () => {
  let hasher: Argon2Hasher;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [Argon2Hasher],
    }).compile();

    hasher = moduleRef.get(Argon2Hasher);
  });

  test('should be defined', () => {
    expect(hasher).toBeDefined();
  });

  test('should return a hashed string successfully', async () => {
    const hashSpy = jest
      .spyOn(argon2, 'hash')
      .mockResolvedValue('hashed-some-password');

    const result = await hasher.hash('some-password');

    expect(result).toBe('hashed-some-password');
    expect(hashSpy).toHaveBeenCalledWith('some-password', {
      type: argon2.argon2id,
    });
  });

  test('should return true when the verification is valid', async () => {
    const verifySpy = jest.spyOn(argon2, 'verify');
    verifySpy.mockResolvedValue(true);

    const result = await hasher.verify('hashed-string', 'password');

    expect(result).toBe(true);
    expect(verifySpy).toHaveBeenCalledWith('hashed-string', 'password');
  });
});
