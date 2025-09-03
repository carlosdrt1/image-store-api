import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { RegisterUserDto } from '../dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.registerUser.execute(dto);
  }
}
