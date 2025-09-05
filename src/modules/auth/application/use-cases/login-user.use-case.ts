import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FindByEmailUseCase } from 'src/modules/users/application/use-cases/find-by-email.use-case';
import { LoginInput } from '../dto/login-input.dto';
import { Hasher } from '../../domain/security/hasher.abstract';
import { TokenService } from '../../domain/security/token.service.abstract';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly findByEmailUseCase: FindByEmailUseCase,
    private readonly hasher: Hasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginInput): Promise<{ token: string }> {
    const user = await this.findByEmailUseCase.execute(dto.email);

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    if (!(await this.hasher.verify(user.getPassword(), dto.password))) {
      throw new UnauthorizedException('invalid credentials');
    }

    return {
      token: await this.tokenService.generateToken({ userId: user.getId() }),
    };
  }
}
