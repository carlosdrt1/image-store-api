import { faker } from '@faker-js/faker';
import { User } from 'src/modules/users/domain/user.entity';

export const userFactory = (override?: {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}): User => {
  const userData = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  };

  return new User(
    userData.id,
    userData.name,
    userData.email,
    userData.password,
  );
};
