
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus/dist/terminus.module';

import { ApiModule } from '@api/api.module';
import mikroOrmOpts from '@database/mikro-orm.config';
import { AppController } from './app.controller';

@Module({
    imports: [
        MikroOrmModule.forRoot(mikroOrmOpts),
        ApiModule,
        ConfigModule.forRoot({ isGlobal: true }),
        TerminusModule,
    ],
    controllers: [AppController],
    providers: [
    ],
})
export class AppModule {}
