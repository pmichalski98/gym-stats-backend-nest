import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Exercise } from '@prisma/client';

export class TrainingEndDto {
  @IsNotEmpty()
  exercises: Omit<Exercise, 'trainingUnitId' | 'id'>[];
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;
  @IsNotEmpty()
  @IsString()
  endedAt: Date;
}
