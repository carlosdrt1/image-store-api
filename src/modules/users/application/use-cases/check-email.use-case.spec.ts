import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../domain/user.repository.abstract';
import { CheckEmailUseCase } from './check-email.use-case';

describe('CheckEmailUseCase', () => {
  let useCase: CheckEmailUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [CheckEmailUseCase],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return {
            existsByEmail: jest.fn(),
          };
        }
      })
      .compile();

    useCase = moduleRef.get(CheckEmailUseCase);
    userRepository = moduleRef.get(UserRepository);
  });

  test('should return true if the email exists', async () => {
    userRepository.existsByEmail.mockResolvedValue(true);

    const result = await useCase.execute('email@email.com');

    expect(result).toBe(true);
    expect(userRepository.existsByEmail).toHaveBeenCalledWith(
      'email@email.com',
    );
  });

  test('should return false if the email do not exists', async () => {
    userRepository.existsByEmail.mockResolvedValue(false);

    const result = await useCase.execute('email@email.com');

    expect(result).toBe(false);
    expect(userRepository.existsByEmail).toHaveBeenCalledWith(
      'email@email.com',
    );
  });
});
