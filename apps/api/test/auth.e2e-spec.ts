import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module';

interface UserResponseBody {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface SessionResponseBody {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface ErrorResponseBody {
  message: string;
}

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  const credentials = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'super-secret-1',
  };

  beforeAll(async () => {
    // DATABASE_URL / JWT_SECRET / JWT_EXPIRES_IN come from
    // test/setup-e2e.ts (jest-e2e.json's `setupFiles`), pointed at the
    // dedicated code_connect_test database so this suite never touches
    // development data.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    // Truncate rather than relying on unique test data, so the suite is
    // repeatable across runs without a manual reset step.
    await app.get(DataSource).query('TRUNCATE TABLE "users" CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('registers a new user without leaking the password hash', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(credentials)
        .expect(201);

      expect(res.body).toMatchObject({
        name: credentials.name,
        email: credentials.email,
      });
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('passwordHash');
      expect(res.headers.location).toBe(
        `/users/${(res.body as UserResponseBody).id}`,
      );
    });

    it('rejects a duplicate email with 409', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(credentials)
        .expect(409);
    });

    it('rejects an invalid payload with 400', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ name: 'A', email: 'not-an-email', password: '123' })
        .expect(400);
    });
  });

  describe('POST /sessions', () => {
    it('logs in with the right credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/sessions')
        .send({ email: credentials.email, password: credentials.password })
        .expect(201);

      expect(res.body).toMatchObject({ tokenType: 'Bearer', expiresIn: 3600 });
      expect(typeof (res.body as SessionResponseBody).accessToken).toBe(
        'string',
      );
    });

    it('rejects a wrong password with a generic message', async () => {
      const res = await request(app.getHttpServer())
        .post('/sessions')
        .send({ email: credentials.email, password: 'wrong-password' })
        .expect(401);

      expect((res.body as ErrorResponseBody).message).toBe(
        'Invalid email or password',
      );
    });

    it('rejects an unknown email with the same generic message', async () => {
      const res = await request(app.getHttpServer())
        .post('/sessions')
        .send({ email: 'nobody@example.com', password: credentials.password })
        .expect(401);

      expect((res.body as ErrorResponseBody).message).toBe(
        'Invalid email or password',
      );
    });
  });

  describe('GET /users/me', () => {
    async function login() {
      const res = await request(app.getHttpServer())
        .post('/sessions')
        .send({ email: credentials.email, password: credentials.password })
        .expect(201);
      return (res.body as SessionResponseBody).accessToken;
    }

    it('returns the logged-in user for a valid token', async () => {
      const accessToken = await login();

      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toMatchObject({
        name: credentials.name,
        email: credentials.email,
      });
    });

    it('rejects a missing token with 401', () => {
      return request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('rejects a malformed token with 401', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer garbage')
        .expect(401);
    });
  });
});
