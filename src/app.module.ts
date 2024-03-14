
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus/dist/terminus.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { ApiModule } from '@api/api.module';
import mikroOrmOpts from '@database/mikro-orm.config';
import { AppController } from './app.controller';

@Module({
    imports: [
        MikroOrmModule.forRoot(mikroOrmOpts),
        ApiModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([
            {
                // defaults from https://docs.nestjs.com/security/rate-limiting
                ttl: 60000,
                limit: 10,
            },
        ]),
        TerminusModule,
    ],
    controllers: [AppController],
    providers: [
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
      },
    ],
})
export class AppModule {}
