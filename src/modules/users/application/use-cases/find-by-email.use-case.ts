import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.abstract';
import { User } from '../../domain/user.entity';

@Injectable()
export class FindByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
