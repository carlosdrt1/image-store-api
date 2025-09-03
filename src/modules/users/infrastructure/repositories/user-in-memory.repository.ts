import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository.abstract';

export class UserInMemoryRepository extends UserRepository {
  private users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = this.users.find((user) => user.getEmail() === email);
    return Promise.resolve(!!user);
  }
}
