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

@UseGuards(AuthGuard)
@Controller('trainings')
export class TrainingsController {
  constructor(private trainingsService: TrainingsService) {}
  @Get()
  getTrainings(@Session() session: any) {
    return this.trainingsService.getTrainings(session.userId);
  }
  @Post()
  createTraining(@Body() dto: CreateTrainingDto, @Session() session: any) {
    return this.trainingsService.createTraining(dto, session.userId);
  }
  @Get(':id')
  getTraining(@Param('id') id: string, @Session() session: any) {}
  @Patch(':id')
  editTraining(
    @Body() editDto: EditTrainingDto,
    @Param('id') id: string,
    @Session() session: any,
  ) {}
  @Delete(':id')
  deleteTraining(@Param('id') id: string, @Session() session: any) {}
}
