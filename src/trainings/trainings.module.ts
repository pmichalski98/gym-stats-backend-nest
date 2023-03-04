import { Module } from '@nestjs/common';
import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingSchema } from './trainings.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Training', schema: TrainingSchema }]),
  ],
  controllers: [TrainingsController],
  providers: [TrainingsService],
})
export class TrainingsModule {}
