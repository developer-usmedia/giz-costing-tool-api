
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus/dist/terminus.module';
import { ThrottlerModule } from '@nestjs/throttler';

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
                ttl: 60 * 60 * 10000,
                 // Setting here are required to be able to override them on routes with @Throttle
                 // Found a way to set a single endpoint throttle without configuring default global settings?
                 // Please implement
                limit: 99999999999999,
            },
        ]),
        TerminusModule,
    ],
    controllers: [AppController],
    providers: [
    ],
})
export class AppModule {}
