import { IsArray, IsOptional, IsString } from 'class-validator';
import { Exercise } from '@prisma/client';

export class EditTrainingDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsArray()
  exercises?: Exercise[];
}
