import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EditTrainingDto } from './dtos/edit-training.dto';
import { TrainingsService } from './trainings.service';
import { CreateTrainingDto } from './dtos/create-training.dto';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(AuthGuard)
@Controller('trainings')
export class TrainingsController {
  constructor(
    private trainingsService: TrainingsService,
    private prisma: PrismaService,
  ) {}

  @Get('/cleardb')
  clearDb() {
    // DEV ONLY DELETE LATER
    return this.prisma.cleanDb();
  }
  @Get()
  getTrainings(@Session() session: any) {
    return this.trainingsService.getTrainings(session.userId);
  }
  @Post()
  createTraining(@Body() dto: CreateTrainingDto, @Session() session: any) {
    return this.trainingsService.createTraining(dto, session.userId);
  }
  @Get(':id')
  getTraining(@Param('id') trainingId: string, @Session() session: any) {
    return this.trainingsService.getTrainingById(trainingId, session.userId);
  }
  @Patch(':id')
  editTraining(
    @Body() dto: EditTrainingDto,
    @Param('id') trainingId: string,
    @Session() session: any,
  ) {
    return this.trainingsService.editTraining(trainingId, session.userId, dto);
  }
  @Delete(':id')
  deleteTraining(@Param('id') trainingId: string, @Session() session: any) {
    return this.trainingsService.deleteTraining(trainingId);
  }
}
