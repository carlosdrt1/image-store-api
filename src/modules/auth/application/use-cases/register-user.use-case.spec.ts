import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from './register-user.use-case';
import { CheckEmailUseCase } from 'src/modules/users/application/use-cases/check-email.use-case';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/create-user.use-case';
import { Hasher } from '../../domain/security/hasher.abstract';
import { ConflictException } from '@nestjs/common';

describe('CheckEmailUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let checkEmailUseCase: jest.Mocked<CheckEmailUseCase>;
  let hasher: jest.Mocked<Hasher>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [RegisterUserUseCase],
    })
      .useMocker((token) => {
        if (token === CheckEmailUseCase) {
          return {
            execute: jest.fn(),
          };
        }
        if (token === CreateUserUseCase) {
          return {
            execute: jest.fn(),
          };
        }
        if (token === Hasher) {
          return {
            hash: jest
              .fn()
              .mockImplementation((text: string) => `hashed-${text}`),
          };
        }
      })
      .compile();

    registerUserUseCase = moduleRef.get(RegisterUserUseCase);
    checkEmailUseCase = moduleRef.get(CheckEmailUseCase);
    hasher = moduleRef.get(Hasher);
  });

  test('should be defined', () => {
    expect(registerUserUseCase).toBeDefined();
  });

  test('should register an user successfully', async () => {
    checkEmailUseCase.execute.mockResolvedValue(false);
    const userData = {
      name: 'any-name',
      email: 'email@email.com',
      password: 'password',
    };

    await registerUserUseCase.execute(userData);

    expect(checkEmailUseCase.execute).toHaveBeenCalledWith(userData.email);
    expect(hasher.hash).toHaveBeenCalledWith(userData.password);
  });

  test('should fail if the email is already in use', async () => {
    checkEmailUseCase.execute.mockResolvedValue(true);
    const userData = {
      name: 'any-name',
      email: 'email@email.com',
      password: 'password',
    };

    await expect(registerUserUseCase.execute(userData)).rejects.toThrow(
      ConflictException,
    );
  });
});
