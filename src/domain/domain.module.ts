import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { ConfigModule } from '@nestjs/config';

import { mikroOrmOpts, entities } from '@domain/database/mikro-orm.config';
import { UserAwareInterceptor } from '@domain/interceptors';
import { EmailModule } from '@email/email.module';
import {
    EntryService,
    EntryWorkerService,
    ScenarioService,
    ScenarioWorkerService,
    UserService,
} from '@domain/services';
import { JwtModule } from '@nestjs/jwt';
import { environment } from 'environment';

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
        ScenarioService,
        ScenarioWorkerService,
    ],
    providers: [
        EntryService,
        UserService,
        EntryWorkerService,
        ScenarioService,
        ScenarioWorkerService,
        { provide: APP_INTERCEPTOR, useClass: UserAwareInterceptor },
    ],
})
export class DomainModule {}
