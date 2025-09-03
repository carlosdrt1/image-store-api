import { ConflictException, Injectable } from '@nestjs/common';
import { CheckEmailUseCase } from 'src/modules/users/application/use-cases/check-email.use-case';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/create-user.use-case';
import { Hasher } from '../../domain/security/hasher.abstract';
import { ResponseUserOutput } from 'src/modules/users/application/dto/user-output.dto';
import { CreateUserInput } from 'src/modules/users/application/dto/user-input.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly checkEmail: CheckEmailUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly hasher: Hasher,
  ) {}

  async execute(dto: CreateUserInput): Promise<ResponseUserOutput> {
    const emailExists = await this.checkEmail.execute(dto.email);
    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hasher.hash(dto.password);

    const user = await this.createUser.execute({
      ...dto,
      password: hashedPassword,
    });
    return user;
  }
}
