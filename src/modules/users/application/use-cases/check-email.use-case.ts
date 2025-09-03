import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.abstract';

@Injectable()
export class CheckEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }
}
