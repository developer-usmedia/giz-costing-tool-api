import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { entities } from '@database/mikro-orm.config';
import { EmailService } from '@domain/services/email.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';
import { AuthService } from './services/auth.service';
import { EntryService } from './services/entry.service';

Module({
    imports: [MikroOrmModule.forFeature(entities)],
    exports: [
        WorkerService,
        EntryService,
          UserService,
          AuthService,
          EmailService,
        UserService,
        EmailService,
        WorkerService,
    ],
    providers: [
        WorkerService,
        EntryService,
          UserService,
          AuthService,
          EmailService,
        UserService,
        EmailService,
        WorkerService,
    ],
});
export class DomainModule {}
