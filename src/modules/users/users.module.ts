import { Module } from '@nestjs/common';
import { FindByEmailUseCase } from './application/use-cases/find-by-email.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserRepository } from './domain/repositories/user.repository.abstract';
import { DynamoUserRepository } from './infrastructure/repositories/dynamo-user.repository';

@Module({
  providers: [
    FindByEmailUseCase,
    CreateUserUseCase,
    { provide: UserRepository, useClass: DynamoUserRepository },
  ],
  exports: [FindByEmailUseCase, CreateUserUseCase],
})
export class UsersModule {}
