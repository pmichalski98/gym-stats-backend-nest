import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';

import { promisify } from 'util';
import { AuthDto } from './dtos/auth.dto';
import { PrismaService } from '../prisma/prisma.service';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
    const password = salt.concat('.').concat(hash.toString('hex'));
    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, password },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email is taken');
      }
      throw error;
    }
  }

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }
}
