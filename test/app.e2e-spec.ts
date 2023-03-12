import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dtos/auth.dto';
import * as pactum from 'pactum';
import { UpdateUserDto } from '../src/users/dtos/update-user.dto';
import { CreateTrainingDto } from '../src/trainings/dtos/create-training.dto';
import { EditTrainingDto } from '../src/trainings/dtos/edit-training.dto';

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
    it('should get signed user', () => {
      return pactum
        .spec()
        .get('/user/me')
        .withHeaders({ Cookie: cookie })
        .expectStatus(200);
    });
    it('should throw if user is not signed in', function () {
      return pactum.spec().get('/user/me').expectStatus(403);
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
    const foundTrainingsIds = [];
    const createTrainingDto: CreateTrainingDto = {
      title: 'Plan A',
      exercises: [
        {
          name: 'klata',
          sets: 3,
          reps: 12,
          weight: 60,
        },
        {
          name: 'barki',
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
          name: 'plecy',
          sets: 4,
          reps: 11,
          weight: 55,
        },
      ],
    };
    const editDto: EditTrainingDto = {
      title: 'Plan XD',
      exercises: [
        {
          name: 'brzuch',
          sets: 3,
          reps: 13,
          weight: 80,
        },
        {
          name: 'lydki',
          sets: 3,
          reps: 13,
          weight: 80,
        },
      ],
    };

    describe('can get trainings', () => {
      it('should get empty trainings', function () {
        return pactum
          .spec()
          .get('/trainings')
          .withHeaders({ Cookie: cookie })
          .expectStatus(200)
          .expectBody([]);
      });
      it('should throw if user not signed in', function () {
        return pactum.spec().get('/trainings').expectStatus(403);
      });
    });
    describe('can create training', () => {
      it('should create training with exercises ', function () {
        return pactum
          .spec()
          .post('/trainings')
          .withHeaders({ Cookie: cookie })
          .withBody(createTrainingDto)
          .expectStatus(201)
          .stores('firstTrainingId', 'id')
          .expectBodyContains('Plan A');
      });
      it('should throw if bad dto', function () {
        return pactum
          .spec()
          .post('/trainings')
          .withHeaders({ Cookie: cookie })
          .withBody({ badrequest: 'halo' })
          .expectStatus(400);
      });
      it('should create another training with exercises ', function () {
        return pactum
          .spec()
          .post('/trainings')
          .withHeaders({ Cookie: cookie })
          .withBody(createTrainingDto2)
          .expectBodyContains('Plan B')
          .expectStatus(201)
          .stores('secondTrainingId', 'id');
      });
    });
    describe('can get trainings', () => {
      it('should get both added trainings', function () {
        return pactum
          .spec()
          .get('/trainings')
          .withHeaders({ Cookie: cookie })
          .expectJsonLength(2)
          .returns((ctx) => {
            ctx.res.body.map((training) => {
              foundTrainingsIds.push(training.id);
            });
          });
      });
    });
    describe('can get one training', () => {
      it('should get one training', function () {
        return pactum
          .spec()
          .get('/trainings/{id}')
          .withPathParams('id', '$S{secondTrainingId}')
          .withHeaders({ Cookie: cookie })
          .expectBodyContains('Plan B')
          .expectStatus(200);
      });
      it('should throw if training doesnt exist', function () {
        return pactum
          .spec()
          .get('/trainings/{id}')
          .withPathParams('id', 'wrongtrainingid')
          .withHeaders({ Cookie: cookie })
          .expectStatus(404);
      });
    });

    describe('can edit training', () => {
      it('should edit training', function () {
        return pactum
          .spec()
          .patch('/trainings/{id}')
          .withPathParams('id', '$S{secondTrainingId}')
          .withHeaders({ Cookie: cookie })
          .withBody(editDto)
          .expectStatus(200)
          .expectBodyContains('brzuch');
      });
    });
    describe('can delete training', () => {
      it('should delete training by id', function () {
        return pactum
          .spec()
          .delete('/trainings/{id}')
          .withPathParams('id', '$S{secondTrainingId}')
          .withHeaders({ Cookie: cookie })
          .expectStatus(200)
          .expectBodyContains('$S{secondTrainingId}');
      });
    });
    describe('can get training', () => {
      it('should return one training', function () {
        return pactum
          .spec()
          .get('/trainings/{id}')
          .withPathParams('id', '$S{firstTrainingId}')
          .withHeaders({ Cookie: cookie })
          .expectStatus(200)
          .expectBodyContains('Plan A');
      });
    });
  });
});
