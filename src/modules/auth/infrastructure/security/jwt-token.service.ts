import { Injectable } from '@nestjs/common';
import { TokenService } from '../../domain/security/token.service.abstract';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../../domain/security/types/user-payload.type';

@Injectable()
export class JwtTokenService extends TokenService {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  generateToken(payload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verifyToken(token: string): Promise<UserPayload> {
    return this.jwtService.verifyAsync(token);
  }
}
