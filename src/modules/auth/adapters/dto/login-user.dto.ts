import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginInput } from '../../application/dto/login-input.dto';

export class LoginUserDto implements LoginInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
