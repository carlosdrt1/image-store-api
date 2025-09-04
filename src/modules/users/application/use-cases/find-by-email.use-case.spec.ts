import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../domain/user.repository.abstract';
import { FindByEmailUseCase } from './find-by-email.use-case';
import { User } from '../../domain/user.entity';

describe('FindByEmailUseCase', () => {
  let useCase: FindByEmailUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [FindByEmailUseCase],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return {
            findByEmail: jest.fn(),
          };
        }
      })
      .compile();

    useCase = moduleRef.get(FindByEmailUseCase);
    userRepository = moduleRef.get(UserRepository);
  });

  test('should return an user if exists', async () => {
    userRepository.findByEmail.mockResolvedValue(
      new User('any-id', 'any-name', 'email@email.com', 'hashed-pass'),
    );

    const result = await useCase.execute('email@email.com');

    expect(result).toBeInstanceOf(User);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('email@email.com');
  });

  test('should return false if the email do not exists', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute('email@email.com');

    expect(result).toBe(null);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('email@email.com');
  });
});
