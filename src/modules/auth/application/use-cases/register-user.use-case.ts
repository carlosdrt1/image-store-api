import { ConflictException, Injectable } from '@nestjs/common';
import { FindByEmailUseCase } from 'src/modules/users/application/use-cases/find-by-email.use-case';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/create-user.use-case';
import { HasherService } from '../../domain/security/hasher.service.abstract';
import { ResponseUserOutput } from 'src/modules/users/application/dto/user-output.dto';
import { CreateUserInput } from 'src/modules/users/application/dto/user-input.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly checkEmail: FindByEmailUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly hasherService: HasherService,
  ) {}

  async execute(dto: CreateUserInput): Promise<ResponseUserOutput> {
    const emailExists = await this.checkEmail.execute(dto.email);
    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hasherService.hash(dto.password);

    const user = await this.createUser.execute({
      ...dto,
      password: hashedPassword,
    });
    return user;
  }
}
