import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainingDto } from './dtos/create-training.dto';
import { EditTrainingDto } from './dtos/edit-training.dto';

@Injectable()
export class TrainingsService {
  constructor(private prisma: PrismaService) {}

  getTrainings(userId: string) {
    return this.prisma.training.findMany({
      where: { userId },
      include: { exercises: true },
    });
  }
  async createTraining(dto: CreateTrainingDto, userId: string) {
    try {
      return this.prisma.training.create({
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
      throw new Error(error);
    }
  }
  async getTrainingById(trainingId: string, userId: string) {
    const training = await this.prisma.training.findFirst({
      where: { id: trainingId, userId },
    });
    if (!training) {
      throw new NotFoundException('Training not found');
    }
    return training;
  }

  async editTraining(trainingId: string, userId: string, dto: EditTrainingDto) {
    const training = await this.prisma.training.findUnique({
      where: { id: trainingId },
    });
    if (!training || training.userId !== userId) {
      throw new ForbiddenException(' Access denied ');
    }
    try {
      return this.prisma.training.update({
        where: { id: trainingId },
        data: {
          title: dto.title,
          exercises: {
            deleteMany: {
              trainingId,
            },
            createMany: { data: dto.exercises },
          },
        },
        include: { exercises: true },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  deleteTraining(trainingId: string) {
    return this.prisma.training.delete({ where: { id: trainingId } });
  }
}
