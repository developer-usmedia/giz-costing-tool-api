import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@app/app.module';
import { EmailService } from '@domain/services/email.service';

describe('/auth', () => {
    let app: INestApplication<App>;
    let token: string;

    const userCredentials = {
        email: 'test@usmedia.nl',
        password: 'changeme',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('auth - login & register', () => {
        it('/auth/register should create new user & validate existing one', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(userCredentials)
                .expect(201);

            expect(response.body.user).toHaveProperty('email');
            expect(response.body.user).not.toHaveProperty('password');

            await request(app.getHttpServer())
              .post('/auth/register')
              .send(userCredentials)
              .expect(400);
        });

        it('/auth/login (POST) should respond 400 on invalid password', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    ...userCredentials,
                    password: 'INVALID',
                })
                .expect(401);
        });

        it('/auth/login (POST) should respond with a token on correct login', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(userCredentials)
                .expect(200);

            expect(response.body).toHaveProperty('token');
            token = response.body.token;
        });

        it('/users (GET) should give access when token is supplied', async () => {
            await request(app.getHttpServer())
                .get('/users')
                .expect(401);

            const response = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body).toHaveProperty('users');
        });
    });

    describe('auth - password reset', () => {
        beforeAll(() => {
            jest.spyOn(EmailService.prototype, 'send').mockImplementation(() => Promise.resolve(true));
        });

        it('auth/forgot-password', async () => {
            const errorResponse = await request(app.getHttpServer())
                .post('/auth/forgot-password')
                .send({ email: 'notfound@usmedia.nl' })
                .expect(400);

            expect(errorResponse.body.message).toEqual('Forgot password failed');

            const response = await request(app.getHttpServer())
                .post('/auth/forgot-password')
                .send({ email: userCredentials.email })
                .expect(200);

            expect(response.body.resetEmailSent).toBeTruthy();

            // TODO: Figure out mikro-orm for testing purposes.
            // TODO: Fetch user with email userCredentials.email -> get token
            // TODO: & do /auth/reset-password request
        });

        afterAll(() => {
            jest.clearAllMocks();
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
