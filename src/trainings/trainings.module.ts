import { Module } from '@nestjs/common';
import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';
import { TrainingsRepository } from './trainings.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from './training.entity';

@Module({
  controllers: [TrainingsController],
  providers: [TrainingsService, TrainingsRepository],
})
export class TrainingsModule {}
