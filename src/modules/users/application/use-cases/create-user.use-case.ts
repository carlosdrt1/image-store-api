import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.abstract';
import { User } from '../../domain/user.entity';
import { randomUUID } from 'crypto';
import { CreateUserInput } from '../dto/user-input.dto';
import { ResponseUserOutput } from '../dto/user-output.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserInput): Promise<ResponseUserOutput> {
    const user = new User(randomUUID(), dto.name, dto.email, dto.password);
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
