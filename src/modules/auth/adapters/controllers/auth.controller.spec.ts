import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { userFactory } from 'test/factories/user.factory';

describe('AuthController', () => {
  let authController: AuthController;
  let registerUserUseCase: jest.Mocked<RegisterUserUseCase>;
  let loginUserUseCase: jest.Mocked<LoginUserUseCase>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          return { execute: jest.fn() };
        }
      })
      .compile();

    authController = moduleRef.get(AuthController);
    registerUserUseCase = moduleRef.get(RegisterUserUseCase);
    loginUserUseCase = moduleRef.get(LoginUserUseCase);
  });

  test('should be defined', () => {
    expect(authController).toBeDefined();
  });

  test('should call registerUserUseCase and return an user created', async () => {
    const registerData = {
      name: 'name',
      email: 'user@email.com',
      password: 'password',
    };

    const userDb = userFactory(registerData);
    const userResponse = {
      id: userDb.getId(),
      name: userDb.getName(),
      email: userDb.getEmail(),
      createdAt: userDb.getCreatedAt(),
      updatedAt: userDb.getUpdatedAt(),
    };

    registerUserUseCase.execute.mockResolvedValue(userResponse);

    const result = await authController.register(registerData);

    expect(result).toStrictEqual(userResponse);
    expect(registerUserUseCase.execute).toHaveBeenCalledWith(registerData);
  });

  test('should call registerUserUseCase and return a signed jwt', async () => {
    loginUserUseCase.execute.mockResolvedValue({ token: 'signed-jwt' });
    const loginData = {
      email: 'user@email.com',
      password: 'password',
    };

    const result = await authController.login(loginData);

    expect(result).toStrictEqual({ token: 'signed-jwt' });
    expect(loginUserUseCase.execute).toHaveBeenCalledWith(loginData);
  });
});
