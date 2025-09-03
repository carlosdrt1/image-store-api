import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.abstract';
import { User } from '../../domain/user.entity';
import { v7 as uuidv7 } from 'uuid';
import { CreateUserInput } from '../dto/user-input.dto';
import { ResponseUserOutput } from '../dto/user-output.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserInput): Promise<ResponseUserOutput> {
    const user = new User(uuidv7(), dto.name, dto.email, dto.password);
    const createdUser = await this.userRepository.create(user);

    return {
      id: createdUser.getId(),
      name: createdUser.getName(),
      email: createdUser.getEmail(),
      createdAt: createdUser.getCreatedAt(),
      updatedAt: createdUser.getUpdatedAt(),
    };
  }
}
