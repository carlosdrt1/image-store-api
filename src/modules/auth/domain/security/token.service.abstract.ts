import { UserPayload } from './types/user-payload.type';

export abstract class TokenService {
  abstract generateToken(payload: UserPayload): Promise<string>;
  abstract verifyToken(token: string): Promise<UserPayload>;
}
