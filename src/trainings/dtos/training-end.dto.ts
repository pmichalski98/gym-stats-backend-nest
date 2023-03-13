import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Exercise } from '@prisma/client';

export class TrainingEndDto {
  @IsNotEmpty()
  exercises: Exercise[];
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;
  @IsNotEmpty()
  @IsString()
  endedAt: Date;
}
