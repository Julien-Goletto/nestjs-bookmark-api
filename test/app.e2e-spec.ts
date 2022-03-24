import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'julien.goletto@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('Should throw error if no body is provided', () => {
        return pactum.spec().post('/auth/signup').withBody({}).expectStatus(400);
      });
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('Should throw error if password is empty', () => {
        return pactum.spec().post('/auth/signup').withBody({ email: dto.email }).expectStatus(400);
      });
      it('Should sign up', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('Should throw error if no body is provided', () => {
        return pactum.spec().post('/auth/signin').withBody({}).expectStatus(400);
      });
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('Should throw error if password is empty', () => {
        return pactum.spec().post('/auth/signin').withBody({ email: dto.email }).expectStatus(400);
      });
      it('Should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAT', 'access_token'); // Stores method allow to keep in memory the AT to pass it to next tests
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' }) // To catch the stored token and pass it to the Headers
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {});
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmarks by id', () => {});
    describe('Edit bookmark by id', () => {});
    describe('Delete bookmark by id', () => {});
  });
});
