import { Module } from '@nestjs/common';
import { CheckEmailUseCase } from './application/use-cases/check-email.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserInMemoryRepository } from './infrastructure/repositories/user-in-memory.repository';
import { UserRepository } from './domain/user.repository.abstract';

@Module({
  providers: [
    CheckEmailUseCase,
    CreateUserUseCase,
    { provide: UserRepository, useClass: UserInMemoryRepository },
  ],
  exports: [CheckEmailUseCase, CreateUserUseCase],
})
export class UsersModule {}
