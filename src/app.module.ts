import { Module } from '@nestjs/common';
import { TrainingsModule } from './trainings/trainings.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TrainingsModule, UsersModule, PrismaModule, AuthModule],
})
export class AppModule {}
