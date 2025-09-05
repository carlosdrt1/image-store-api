import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { LoginUserDto } from '../dto/login-user.dto';
import { ResponseUserOutput } from 'src/modules/users/application/dto/user-output.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto): Promise<ResponseUserOutput> {
    return this.registerUserUseCase.execute(body);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto): Promise<{ token: string }> {
    return this.loginUserUseCase.execute(body);
  }
}
