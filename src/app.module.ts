import { Global, Module } from '@nestjs/common';
import { TrainingsModule } from './trainings/trainings.module';
import { ExercisesModule } from './exercises/exercises.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TrainingsModule,
    ExercisesModule,
    UsersModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
