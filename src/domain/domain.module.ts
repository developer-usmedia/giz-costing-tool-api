import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { entities } from '@database/mikro-orm.config';
import { UserService } from './services/user.service';

Module({
    imports: [MikroOrmModule.forFeature(entities)],
    exports: [UserService],
    providers: [],
});
export class DomainModule {}
