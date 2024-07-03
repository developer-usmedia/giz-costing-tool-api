import { MikroORM } from '@mikro-orm/postgresql';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

import { AppModule } from '@app/app.module';
import { environment } from '@app/environment';
import mikroOrmOpts from '@domain/database/mikro-orm.config';

const logger = new Logger('main.ts');

const setupSwagger = (app: INestApplication<any>) => {
    const config = new DocumentBuilder()
        .setTitle('GIZ Costing Tool API')
        .setDescription('API for the GIZ Living Wage Costing Tool')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
};

async function runMigrations(): Promise<void> {
    if (environment.api.isLocal === false) {
        logger.debug(`Running migrations... (${environment.api.env})`);
        try {
            const orm = await MikroORM.init(mikroOrmOpts);

            const migrator = orm.getMigrator();
            const pending = await migrator.getPendingMigrations();
            logger.debug(`Pending migrations: ${pending.length}`);

            if (!pending.length) {
                return;
            }

            const ranMigrations = await migrator.up();
            logger.debug(`Ran ${ranMigrations.length} migrations`);
        } catch (err) {
            logger.error(err);
        }
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: [ environment.api.logLevel ],
    });

    if (!environment.isValid()) {
        throw new Error('Missing environment variables, see environment.ts');
    }

    app.setGlobalPrefix('api', { exclude: ['/', 'health', 'health/liveness', 'health/readiness'] });
    app.enableCors({
        origin: environment.api.corsOrigin,
        credentials: true,
    });
    app.use(cookieParser());
    app.use(passport.initialize());
    app.useGlobalPipes(new ValidationPipe());
    
    setupSwagger(app);

    runMigrations();

    await app.listen(3000);
}
bootstrap();
