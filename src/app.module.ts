import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiModule } from '@api/api.module';
import mikroOrmOpts from '@database/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmOpts), 
    ApiModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
