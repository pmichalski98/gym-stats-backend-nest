import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainingDto } from './dtos/create-training.dto';

@Injectable()
export class TrainingsService {
  constructor(private prisma: PrismaService) {}

  async getTrainings(userId: string) {
    return this.prisma.training.findMany({ where: { userId } });
  }

  async createTraining(dto: CreateTrainingDto, userId: string) {
    try {
      console.log(dto, userId);
      return await this.prisma.training.create({
        data: {
          userId: userId,
          title: dto.title,
          exercises: { createMany: { data: dto.exercises } },
        },
        include: {
          exercises: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
