import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { entities } from '@database/mikro-orm.config';
import { EmailService } from '@domain/services/email.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';

Module({
    imports: [MikroOrmModule.forFeature(entities)],
    exports: [UserService, EmailService, WorkerService],
    providers: [],
});
export class DomainModule {}
