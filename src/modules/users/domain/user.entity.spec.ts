import { User } from './user.entity';

describe('UserEntity', () => {
  test('should create an user successfully', () => {
    const user = new User(
      'any-id',
      'any-name',
      'email@email.com',
      'hashed-any-pass',
    );

    expect(user).toBeDefined();
    expect(typeof user.getId()).toBe('string');
    expect(user.getName()).toBe('any-name');
    expect(user.getEmail()).toBe('email@email.com');
    expect(user.getPassword()).toBe('hashed-any-pass');
    expect(user.getCreatedAt()).toBeInstanceOf(Date);
    expect(user.getUpdatedAt()).toBeInstanceOf(Date);
  });

  test('should fail if the name is shorter than 3 characters', () => {
    expect(
      () => new User('any-id', 'na', 'email@email.com', 'any-pass'),
    ).toThrow(Error);
  });

  test('should fail if the email is not an email', () => {
    expect(
      () => new User('any-id', 'any-name', 'invalid.com', 'any-pass'),
    ).toThrow(Error);
  });
});
