import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainingsModule } from './trainings/trainings.module';

@Module({
  imports: [
    TrainingsModule,
    MongooseModule.forRoot(
      'mongodb+srv://nukepower:VlphWNPVfOw1UqKK@gym-app-db.5lw9cwc.mongodb.net/trainings-app?retryWrites=true&w=majority',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
