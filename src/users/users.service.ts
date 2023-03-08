import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  findALl() {
    return this.prisma.user.findMany({});
  }
  async findByEmail(email) {
    return this.prisma.user.findMany({ where: email });
  }

  async findBy(userWhereUniqueInput) {
    if (!userWhereUniqueInput) {
      return null;
    }
    const result = await this.prisma.user.findUnique({
      where: { id: userWhereUniqueInput },
    });
    if (!result) {
      throw new NotFoundException('User not foundasdasdas');
    }
    return result;
  }
  async update(
    data: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput,
  ) {
    const result = await this.prisma.user.update({ where, data });
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }
}
