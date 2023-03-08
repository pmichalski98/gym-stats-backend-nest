import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findALl() {
    return this.repo.find({});
  }

  async findById(id: number) {
    if (!id) {
      return null;
    }
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }
  async findByEmail(email: string) {
    const result = await this.repo.find({ where: { email } });
    if (!result) {
      throw new NotFoundException('User with that email not found');
    }
    return result;
  }

  async update(id: number, dataToUpdate: UpdateUserDto) {
    const result = (await this.repo.update(id, dataToUpdate)).affected;
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  async delete(id: number) {
    return (await this.repo.delete({ id })).affected;
  }
}
