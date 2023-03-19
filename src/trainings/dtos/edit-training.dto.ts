import { IsArray, IsOptional, IsString } from 'class-validator';
import { Exercise } from '@prisma/client';

export class EditTrainingDto {
  @IsString()
  id: string;
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsArray()
  exercises?: Omit<Exercise, 'id' | 'trainingUnitId' | 'trainingId'>[];
}
