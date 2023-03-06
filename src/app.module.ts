import { Module } from '@nestjs/common';
import { TrainingsModule } from './trainings/trainings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from './trainings/training.entity';
import { ExercisesModule } from './exercises/exercises.module';
import { Exercise } from './exercises/exercises.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Training, Exercise, User],
      synchronize: true,
    }),
    TrainingsModule,
    ExercisesModule,
    UsersModule,
  ],
})
export class AppModule {}
