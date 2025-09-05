import { DynamoUser, DynamoUserMapper } from './dynamo-user.mapper';

describe('DynamoUserMapper', () => {
  const dynamoUser: DynamoUser = {
    id: 'any-id',
    name: 'user',
    email: 'email@email.com',
    password: 'hashed-password',
    createdAt: '2001-01-01T12:00:00.000Z',
    updatedAt: '2001-01-01T12:00:00.000Z',
  };

  test('should map DynamoUSer to domain User', () => {
    const user = DynamoUserMapper.toDomain(dynamoUser);

    expect(user.getId()).toBe(dynamoUser.id);
    expect(user.getCreatedAt()).toEqual(new Date(dynamoUser.createdAt));
    expect(user.getUpdatedAt()).toEqual(new Date(dynamoUser.updatedAt));
  });

  test('should map domain User to DynamoUSer', () => {
    const user = DynamoUserMapper.toDomain(dynamoUser);
    const persistence = DynamoUserMapper.toPersistence(user);

    expect(persistence).toEqual(dynamoUser);
  });
});
