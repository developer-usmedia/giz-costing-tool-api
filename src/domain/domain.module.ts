import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { entities } from '@database/mikro-orm.config';
import { BrevoService } from '@domain/services/email.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';
import { AuthService } from './services/auth.service';
import { EntryService } from './services/entry.service';
import { ScenarioService } from './services/scenario.service';

Module({
    imports: [MikroOrmModule.forFeature(entities)],
    exports: [
        AuthService,
        BrevoService,
        BrevoService,
        EntryService,
        ScenarioService,
        UserService,
        UserService,
        WorkerService,
        WorkerService,
    ],
    providers: [
        AuthService,
        BrevoService,
        BrevoService,
        EntryService,
        ScenarioService,
        UserService,
        UserService,
        WorkerService,
        WorkerService,
    ],
});
export class DomainModule {}
