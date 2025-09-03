import { Module } from '@nestjs/common';
import { CheckEmailUseCase } from './application/use-cases/check-email.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserRepository } from './domain/user.repository.abstract';
import { UserDynamoRepository } from './infrastructure/repositories/user-dynamo.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    CheckEmailUseCase,
    CreateUserUseCase,
    { provide: UserRepository, useClass: UserDynamoRepository },
  ],
  exports: [CheckEmailUseCase, CreateUserUseCase],
})
export class UsersModule {}
