import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercises.entity';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  providers: [ExercisesService],
  controllers: [ExercisesController],
})
export class ExercisesModule {}
