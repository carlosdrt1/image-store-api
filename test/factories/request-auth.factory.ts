import { RequestAuth } from 'src/modules/auth/adapters/types/request-auth.type';

export const requestAuthFactory = (
  data?: Partial<RequestAuth>,
): jest.Mocked<RequestAuth> => {
  return {
    user: {
      id: 'any-id',
    },
    ...data,
  } as jest.Mocked<RequestAuth>;
};
