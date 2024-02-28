import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as connectRedis from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import * as session from 'express-session';
import { default as Redis } from 'ioredis';
import * as passport from 'passport';

import { environment } from '@common/environment/environment';
import { AppModule } from './app.module';

const setupSwagger = (app: INestApplication<any>) => {
    const config = new DocumentBuilder()
        .setTitle('GIZ Costing Tool API')
        .setDescription('API for the GIZ Living Wage Costing Tool')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
};

const setupAuth = (app: INestApplication<any>) => {
    const RedisStore = connectRedis(session);
    const redisClient = new Redis({
        host: environment.redis.host,
        port: environment.redis.port,
    });
    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            name: 'GIZ-COOKIE',
            secret: environment.session.secret,
            resave: false,
            saveUninitialized: false,
            genid: () => randomUUID(),
            cookie: {
                maxAge: +environment.session.expiresIn,
                secure: process.env.NODE_ENV !== 'development',
                httpOnly: process.env.NODE_ENV !== 'development',
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    if (!environment.isValid()) {
        throw new Error('Missing environment variables, see environment.ts');
    }

    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:4200'],
        credentials: true,
    });
    app.use(cookieParser());

    setupAuth(app);
    setupSwagger(app);

    await app.listen(3000);
}
bootstrap();
