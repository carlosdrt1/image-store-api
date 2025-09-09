import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserUseCase } from './login-user.use-case';
import { FindByEmailUseCase } from 'src/modules/users/application/use-cases/find-by-email.use-case';
import { HasherService } from '../../domain/security/hasher.service.abstract';
import { TokenService } from '../../domain/security/token.service.abstract';
import { userFactory } from 'test/factories/user.factory';
import { UnauthorizedException } from '@nestjs/common';

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let findByEmailUseCase: jest.Mocked<FindByEmailUseCase>;
  let hasherService: jest.Mocked<HasherService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [LoginUserUseCase],
    })
      .useMocker((token) => {
        if (token === FindByEmailUseCase) {
          return {
            execute: jest.fn(),
          };
        }
        if (token === HasherService) {
          return {
            verify: jest.fn(),
          };
        }
        if (token === TokenService) {
          return {
            generateToken: jest.fn().mockResolvedValue('valid-jwt'),
          };
        }
      })
      .compile();

    loginUserUseCase = moduleRef.get(LoginUserUseCase);
    findByEmailUseCase = moduleRef.get(FindByEmailUseCase);
    hasherService = moduleRef.get(HasherService);
  });

  test('should be defined', () => {
    expect(loginUserUseCase).toBeDefined();
  });

  test('should log in an user successfully', async () => {
    const loginData = {
      email: 'email@email.com',
      password: 'any-pass',
    };
    const userFind = userFactory({ email: loginData.email });

    findByEmailUseCase.execute.mockResolvedValue(userFind);
    hasherService.verify.mockResolvedValue(true);

    const result = await loginUserUseCase.execute(loginData);

    expect(result).toStrictEqual({ token: 'valid-jwt' });
    expect(findByEmailUseCase.execute).toHaveBeenCalledWith(loginData.email);
    expect(hasherService.verify).toHaveBeenCalledWith(
      userFind.getPassword(),
      loginData.password,
    );
  });

  test('should fail if the email is incorrect', async () => {
    const loginData = {
      email: 'email@email.com',
      password: 'any-pass',
    };

    findByEmailUseCase.execute.mockResolvedValue(null);

    await expect(loginUserUseCase.execute(loginData)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  test('should fail if the password is incorrect', async () => {
    const loginData = {
      email: 'email@email.com',
      password: 'any-pass',
    };

    findByEmailUseCase.execute.mockResolvedValue(
      userFactory({ email: loginData.email }),
    );
    hasherService.verify.mockResolvedValue(false);

    await expect(loginUserUseCase.execute(loginData)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
