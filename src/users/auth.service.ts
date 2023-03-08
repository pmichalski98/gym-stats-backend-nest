import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from './users.service';

import { promisify } from 'util';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(email, password) {
    const users = await this.usersService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException(
        'User with this email is already registered',
      );
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt.concat('.').concat(hash.toString('hex'));

    return await this.usersService.create(email, result);
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }
}
