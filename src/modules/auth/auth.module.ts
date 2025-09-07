import { Module } from '@nestjs/common';
import { AuthController } from './adapters/controllers/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { UsersModule } from '../users/users.module';
import { HasherService } from './domain/security/hasher.service.abstract';
import { Argon2HasherService } from './infrastructure/security/argon2-hasher.service';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { TokenService } from './domain/security/token.service.abstract';
import { JwtTokenService } from './infrastructure/security/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './adapters/guards/auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    AuthGuard,
    { provide: HasherService, useClass: Argon2HasherService },
    { provide: TokenService, useClass: JwtTokenService },
  ],
  exports: [AuthGuard, { provide: TokenService, useClass: JwtTokenService }],
})
export class AuthModule {}
