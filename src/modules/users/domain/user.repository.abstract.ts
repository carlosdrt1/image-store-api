import { User } from './user.entity';

export abstract class UserRepository {
  abstract create(data: User): Promise<User>;
  abstract existsByEmail(email: string): Promise<boolean>;
}
