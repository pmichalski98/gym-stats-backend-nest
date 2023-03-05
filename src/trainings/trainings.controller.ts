import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { Training } from './trainings.model';

@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Get('/')
  async getAllTrainings() {
    return await this.trainingsService.getAll();
  }

  @Get(':id')
  async getOneTraining(@Param('id') id: string) {
    return await this.trainingsService.getOne(id);
  }

  @Post('/')
  async addTraining(@Body() training: Training) {
    return await this.trainingsService.addTraining(training);
  }

  @Patch('/')
  async updateTraining(@Body() updatedTraining: Training) {
    return await this.trainingsService.updateTraining(updatedTraining);
  }

  @Delete('/:id')
  async deleteTraining(@Param('id') id: string) {
    return await this.trainingsService.deleteTraining(id);
  }

  @Patch('/start')
  async addTrainingUnit(@Body() training: Training) {
    return await this.trainingsService.addTrainingUnit(training);
  }
}
