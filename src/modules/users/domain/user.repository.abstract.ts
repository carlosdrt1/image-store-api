import { User } from './user.entity';

export abstract class UserRepository {
  abstract create(data: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
