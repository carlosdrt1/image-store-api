import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from './register-user.use-case';
import { FindByEmailUseCase } from 'src/modules/users/application/use-cases/find-by-email.use-case';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/create-user.use-case';
import { Hasher } from '../../domain/security/hasher.abstract';
import { ConflictException } from '@nestjs/common';
import { User } from 'src/modules/users/domain/user.entity';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let findByEmailUseCase: jest.Mocked<FindByEmailUseCase>;
  let hasher: jest.Mocked<Hasher>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [RegisterUserUseCase],
    })
      .useMocker((token) => {
        if (token === FindByEmailUseCase) {
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
    findByEmailUseCase = moduleRef.get(FindByEmailUseCase);
    hasher = moduleRef.get(Hasher);
  });

  test('should be defined', () => {
    expect(registerUserUseCase).toBeDefined();
  });

  test('should register an user successfully', async () => {
    findByEmailUseCase.execute.mockResolvedValue(null);
    const userData = {
      name: 'any-name',
      email: 'email@email.com',
      password: 'password',
    };

    await registerUserUseCase.execute(userData);

    expect(findByEmailUseCase.execute).toHaveBeenCalledWith(userData.email);
    expect(hasher.hash).toHaveBeenCalledWith(userData.password);
  });

  test('should fail if the email is already in use', async () => {
    const userData = {
      name: 'any-name',
      email: 'email@email.com',
      password: 'password',
    };
    findByEmailUseCase.execute.mockResolvedValue(
      new User('any-id', 'user-name', userData.email, 'hashed-pass'),
    );

    await expect(registerUserUseCase.execute(userData)).rejects.toThrow(
      ConflictException,
    );
  });
});
