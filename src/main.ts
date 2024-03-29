import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
const cookieSession = require('cookie-session');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.use(
    cookieSession({
      keys: ['asdasdasdasd'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3001, 'localhost', () => console.log('Listening...'));
}
bootstrap();
