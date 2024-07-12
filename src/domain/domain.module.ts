import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';

import { entities, mikroOrmOpts } from '@domain/database/mikro-orm.config';
import { UserAwareInterceptor } from '@domain/interceptors';
import {
    EntryService,
    EntryWorkerService,
    ScenarioService,
    ScenarioWorkerService,
    UserService,
} from '@domain/services';
import { EmailModule } from '@email/email.module';
import { JwtModule } from '@nestjs/jwt';
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
        EntryWorkerService,
        ReportService,
        ScenarioService,
        ScenarioWorkerService,
    ],
    providers: [
        EntryService,
        UserService,
        EntryWorkerService,
        ReportService,
        ScenarioService,
        ScenarioWorkerService,
        { provide: APP_INTERCEPTOR, useClass: UserAwareInterceptor },
    ],
})
export class DomainModule {}
