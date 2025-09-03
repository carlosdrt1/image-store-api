import { Module } from '@nestjs/common';
import { FindByEmailUseCase } from './application/use-cases/find-by-email.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserRepository } from './domain/user.repository.abstract';
import { UserDynamoRepository } from './infrastructure/repositories/user-dynamo.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    FindByEmailUseCase,
    CreateUserUseCase,
    { provide: UserRepository, useClass: UserDynamoRepository },
  ],
  exports: [FindByEmailUseCase, CreateUserUseCase],
})
export class UsersModule {}
