import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { TokenService } from '../../domain/security/token.service.abstract';
import { requestAuthFactory } from 'test/factories/request-auth.factory';

const mockTokenService: jest.Mocked<TokenService> = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
};

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(() => {
    authGuard = new AuthGuard(mockTokenService);
  });

  test('should allow access if the token is valid', async () => {
    mockTokenService.verifyToken.mockResolvedValue({ userId: 'any-id' });
    const context = contextFactory('Bearer valid=jwt');

    const result = await authGuard.canActivate(context);

    expect(result).toBe(true);
    expect(mockTokenService.verifyToken).toHaveBeenCalledWith('valid=jwt');
  });

  test('should throw UnauthorizedException if no token is provided', async () => {
    const context = contextFactory();

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  test('should throw UnauthorizedException if token is malformated', async () => {
    const context = contextFactory('malformatedinvalid-token');

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  test('should throw UnauthorizedException if tokenService fail verification', async () => {
    mockTokenService.verifyToken.mockRejectedValue(new Error('jwt expired'));
    const context = contextFactory('Bearer jwt-expired');

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

const contextFactory = (token?: string): ExecutionContext => {
  return {
    switchToHttp() {
      return {
        getRequest() {
          return requestAuthFactory({ headers: { authorization: token } });
        },
      };
    },
  } as ExecutionContext;
};
