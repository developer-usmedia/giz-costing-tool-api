import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { entities } from '@database/mikro-orm.config';
import { BrevoService } from '@domain/services/email.service';
import { EntryWorkerService } from '@domain/services/entry-worker.service';
import { UserService } from '@domain/services/user.service';
import { AuthService } from './services/auth.service';
import { EntryService } from './services/entry.service';
import { ScenarioWorkerService } from './services/scenario-worker.service';
import { ScenarioService } from './services/scenario.service';

Module({
    imports: [MikroOrmModule.forFeature(entities)],
    exports: [
        AuthService,
        BrevoService,
        BrevoService,
        EntryService,
        EntryWorkerService,
        ScenarioService,
        ScenarioWorkerService,
        UserService,
        UserService,
    ],
    providers: [
        AuthService,
        BrevoService,
        BrevoService,
        EntryService,
        EntryWorkerService,
        ScenarioService,
        UserService,
        UserService,
    ],
});
export class DomainModule {}
