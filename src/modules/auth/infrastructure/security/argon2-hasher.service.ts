import { Injectable } from '@nestjs/common';
import { HasherService } from '../../domain/security/hasher.service.abstract';
import * as argon2 from 'argon2';

@Injectable()
export class Argon2HasherService extends HasherService {
  async hash(text: string): Promise<string> {
    return argon2.hash(text, {
      type: argon2.argon2id,
    });
  }

  async verify(hashed: string, text: string): Promise<boolean> {
    try {
      return await argon2.verify(hashed, text);
    } catch {
      throw new Error('Password verification failed');
    }
  }
}
