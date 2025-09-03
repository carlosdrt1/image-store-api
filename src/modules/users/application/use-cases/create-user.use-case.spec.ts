import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../domain/user.repository.abstract';
import { CreateUserUseCase } from './create-user.use-case';
import { User } from '../../domain/user.entity';
import { CreateUserInput } from '../dto/user-input.dto';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [CreateUserUseCase],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return {
            create: jest.fn().mockImplementation((user: User) => user),
          };
        }
      })
      .compile();

    useCase = moduleRef.get(CreateUserUseCase);
  });

  test('should create an user successfully', async () => {
    const userData: CreateUserInput = {
      name: 'any-name',
      email: 'email@email.com',
      password: 'password',
    };

    const result = await useCase.execute(userData);

    expect(typeof result.id).toBe('string');
    expect(result.name).toBe('any-name');
    expect(result.email).toBe('email@email.com');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result).not.toHaveProperty('password');
  });
});
