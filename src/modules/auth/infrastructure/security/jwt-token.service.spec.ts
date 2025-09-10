import { Test, TestingModule } from '@nestjs/testing';
import { JwtTokenService } from './jwt-token.service';
import { JwtService } from '@nestjs/jwt';

describe('Argon2HasherService', () => {
  let tokenService: JwtTokenService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [JwtTokenService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return {
            signAsync: jest.fn().mockResolvedValue('signed-jwt'),
            verifyAsync: jest.fn().mockResolvedValue({ userId: 'any-id' }),
          };
        }
      })
      .compile();

    tokenService = moduleRef.get(JwtTokenService);
    jwtService = moduleRef.get(JwtService);
  });

  test('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  test('should generate a token', async () => {
    const payload = { userId: 'any-id' };

    const result = await tokenService.generateToken(payload);

    expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    expect(result).toBe('signed-jwt');
  });

  test('should verify a token', async () => {
    const token = 'any-token';

    const result = await tokenService.verifyToken(token);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
    expect(result).toStrictEqual({ userId: 'any-id' });
  });
});
