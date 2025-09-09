import { User } from '../../domain/entities/user.entity';

export type DynamoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export class DynamoUserMapper {
  static toDomain(item: DynamoUser): User {
    return new User(
      item.id,
      item.name,
      item.email,
      item.password,
      new Date(item.createdAt),
      new Date(item.updatedAt),
    );
  }

  static toPersistence(user: User): DynamoUser {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }
}
