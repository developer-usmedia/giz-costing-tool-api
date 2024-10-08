import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { JwtModule } from '@nestjs/jwt';

import { entities, mikroOrmOpts } from '@domain/database/mikro-orm.config';
import { UserAwareInterceptor } from '@domain/interceptors';
import {
    EntryLivingWageCalculationsService,
    EntryService,
    EntryWorkerService,
    ScenarioLivingWageCalculationsService,
    ScenarioService,
    ScenarioWorkerService,
    UserService,
} from '@domain/services';
import { EmailModule } from '@email/email.module';
import { EntryExportService } from '@export/services/entry-export.service';
import { environment } from 'environment';
import { ReportService } from './services/report.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MikroOrmModule.forRoot(mikroOrmOpts),
        MikroOrmModule.forFeature(entities),
        EmailModule,
        JwtModule.register({
            secret: environment.jwt.secret,
            signOptions: { expiresIn: environment.jwt.expiresIn },
        }),
    ],
    exports: [
        EntryService,
        UserService,
        EntryExportService,
        EntryLivingWageCalculationsService,
        EntryWorkerService,
        ReportService,
        ScenarioLivingWageCalculationsService,
        ScenarioService,
        ScenarioWorkerService,
    ],
    providers: [
        EntryService,
        UserService,
        EntryExportService,
        EntryLivingWageCalculationsService,
        EntryWorkerService,
        ReportService,
        ScenarioLivingWageCalculationsService,
        ScenarioService,
        ScenarioWorkerService,
        { provide: APP_INTERCEPTOR, useClass: UserAwareInterceptor },
    ],
})
export class DomainModule {}
