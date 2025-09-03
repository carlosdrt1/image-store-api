import { Injectable } from '@nestjs/common';
import { Hasher } from '../../domain/security/hasher.abstract';
import * as argon2 from 'argon2';

@Injectable()
export class Argon2Hasher extends Hasher {
  async hash(text: string): Promise<string> {
    return argon2.hash(text, {
      type: argon2.argon2id,
    });
  }

  async verify(hashed: string, text: string): Promise<boolean> {
    try {
      return await argon2.verify(hashed, text);
    } catch (error) {
      console.log(error);
      throw new Error('Password verification failed');
    }
  }
}
