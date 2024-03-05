import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as postgresConnect from 'connect-pg-simple';
import * as cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import * as session from 'express-session';
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
    const pgConnection = postgresConnect(session);
    const pgSessionStore = new pgConnection({
        conString: environment.getPostgresConnectionString(),
        tableName: environment.session.tableName,
        pruneSessionInterval: 900, // Default, added to be explicit
    });

    app.use(
        session({
            store: pgSessionStore,
            name: environment.session.name,
            secret: environment.session.secret,
            resave: false,
            saveUninitialized: false,
            genid: () => randomUUID(),
            cookie: {
                maxAge: environment.session.expiresIn,
                secure: !environment.api.isLocal,
                httpOnly: !environment.api.isLocal,
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
