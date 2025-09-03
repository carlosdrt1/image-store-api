import { Module } from '@nestjs/common';
import { AuthController } from './adapters/controllers/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { UsersModule } from '../users/users.module';
import { Hasher } from './domain/security/hasher.abstract';
import { Argon2Hasher } from './infrastructure/security/argon2-hasher';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [RegisterUserUseCase, { provide: Hasher, useClass: Argon2Hasher }],
})
export class AuthModule {}
