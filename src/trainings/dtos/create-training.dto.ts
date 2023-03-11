import { Exercise } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrainingDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  exercises: Partial<Exercise[]>;
}
