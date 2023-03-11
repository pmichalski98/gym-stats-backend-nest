import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dtos/auth.dto';
import * as pactum from 'pactum';
import { UpdateUserDto } from '../src/users/dtos/update-user.dto';
import { CreateTrainingDto } from '../src/trainings/dtos/create-training.dto';

const cookieSession = require('cookie-session');

let app: INestApplication;
let prisma: PrismaService;
beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();

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
  app.enableCors();
  await app.init();
  await app.listen(3555);

  pactum.request.setBaseUrl('http://localhost:3555');
  prisma = app.get(PrismaService);
  await prisma.cleanDb();
});

afterAll(async () => {
  await app.close();
});

describe('Auth', () => {
  const dto: AuthDto = {
    email: 'e2etest@gmail.com',
    password: 'test',
  };
  describe('signup', () => {
    it('should signup user', async () => {
      return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
    });
    it('should throw without email', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({ password: 'test' })
        .expectStatus(400);
    });
    it('should throw with wrong email syntax', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({ email: 'abu.com', password: 'test' })
        .expectStatus(400);
    });
    it('should throw without password', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({ email: 'test@gmail.com' })
        .expectStatus(400);
    });
    it('should throw with empty dto', () => {
      return pactum.spec().post('/auth/signup').withBody({}).expectStatus(400);
    });
  });
  let cookie;
  let first;
  let second;
  describe('Signin', () => {
    it('should signin user', async () => {
      cookie = await pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .returns((ctx) => {
          return ctx.res.headers['set-cookie'];
        })
        .expectStatus(200);
      first = cookie[0].split(';')[0].concat(';');
      second = cookie[1].split(';')[0];
      cookie = first.concat(' ').concat(second);
    });
    it('should throw without email', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({ password: 'test' })
        .expectStatus(400);
    });
    it('should throw with wrong email syntax', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({ email: 'abu.com', password: 'test' })
        .expectStatus(400);
    });
    it('should throw without password', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({ email: 'test@gmail.com' })
        .expectStatus(400);
    });
    it('should throw with empty dto', () => {
      return pactum.spec().post('/auth/signup').withBody({}).expectStatus(400);
    });
  });
  describe('User', () => {
    it('should get me', () => {
      return pactum
        .spec()
        .get('/user/me')
        .withHeaders({ Cookie: cookie })
        .expectStatus(200);
    });
    it('should edit user', () => {
      const editDto: UpdateUserDto = {
        email: 'editedByTest@gmail.com',
      };
      return pactum
        .spec()
        .patch('/user')
        .withHeaders({ Cookie: cookie })
        .withBody(editDto)
        .expectStatus(200);
    });
  });
  describe('Training', () => {
    describe('can get trainings', () => {
      it('should get empty trainings', function () {
        return pactum
          .spec()
          .get('/trainings')
          .withHeaders({ Cookie: cookie })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('can add training', () => {
      const createTrainingDto: CreateTrainingDto = {
        title: 'Plan A',
        exercises: [
          {
            trainingId: undefined,
            id: undefined,
            name: 'klata',
            sets: 3,
            reps: 12,
            weight: 60,
          },
        ],
      };
      const createTrainingDto2: CreateTrainingDto = {
        title: 'Plan B',
        exercises: [
          {
            trainingId: undefined,
            id: undefined,
            name: 'plecy',
            sets: 4,
            reps: 11,
            weight: 55,
          },
        ],
      };
      it('should add training with exercises ', function () {
        return pactum
          .spec()
          .post('/trainings')
          .withHeaders({ Cookie: cookie })
          .withBody(createTrainingDto)
          .expectStatus(201)
          .expectBodyContains('exercises')
          .expectBodyContains('id')
          .expectBodyContains('userId')
          .inspect();
      });
      it('should add another training with exercises ', function () {
        return pactum
          .spec()
          .post('/trainings')
          .withHeaders({ Cookie: cookie })
          .withBody(createTrainingDto2)
          .expectBodyContains('exercises')
          .expectStatus(201)
          .inspect();
      });
    });
    describe('can get training', () => {});
    describe('can edit training', () => {});
    describe('can delete training', () => {});
    describe('can get training', () => {});
  });
});
