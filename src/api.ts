import { MikroORM, RequestContext } from '@mikro-orm/postgresql';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

import { environment } from 'environment';
import { ApiModule } from '@api/api.module';
import { mikroOrmOpts } from '@domain/database';

const logger = new Logger('api.ts');

const setupSwagger = (app: INestApplication<NestExpressApplication>) => {
    const config = new DocumentBuilder()
        .setTitle('GIZ Costing Tool API')
        .setDescription('API for the GIZ Living Wage Costing Tool')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
};

const runMigrations = async (): Promise<void> => {
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
};

const determineCorsOrigin = (): boolean | string | string[] => {
    const origins = environment.api.corsOrigin;
    if (origins === '*') {
        return true;
    }

    if (origins.length > 0) {
        return origins.split(',');
    }

    return false;
};

const boostrap = async (): Promise<any> => {
    if (!environment.isValid()) {
        throw new Error('Missing environment variables, see environment.ts');
    }

    const api = await NestFactory.create<INestApplication<NestExpressApplication>>(ApiModule, {
        logger: [ environment.api.logLevel ],
    });

    api.setGlobalPrefix('api', { exclude: ['/', 'health', 'health/liveness', 'health/readiness'] });
    api.enableShutdownHooks();
    api.enableCors({ credentials: true, origin: determineCorsOrigin() });
    api.use(cookieParser());
    api.use(passport.initialize());
    const orm = await MikroORM.init(mikroOrmOpts);

    // this is to isolate the request context from the global context
    // MikroORM will always use request specific (forked) entity manager if available to prevent concurrency issues.
    // register requestcontext middleware as the last one, before request handles
    api.use((_req, _res, next) => {
        // calls `orm.em.fork()` and attaches it to the async context
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        RequestContext.create(orm.em, next);
    });

    api.useGlobalPipes(new ValidationPipe());

    await runMigrations();
    setupSwagger(api);

    await api.listen(environment.api.port);
};

boostrap();
