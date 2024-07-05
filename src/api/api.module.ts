import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';

import { JwtStrategy, OTPService, RefreshJwtStrategy } from '@api/auth';
import { DomainModule } from '@domain/domain.module';
import { ImportModule } from '@import/import.module';
import {
    AuthController,
    EntryController,
    EntryScenarioController,
    EntryWorkerController,
    HealthController,
    IndexController,
    TestController,
} from './controllers';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DomainModule,
        ImportModule,
        TerminusModule,
        PassportModule.register({}),
        ThrottlerModule.forRoot([{
            ttl: 60 * 60 * 10000,
            // Setting here are required to be able to override them on routes with @Throttle
            // Found a way to set a single endpoint throttle without configuring default global settings?
            limit: 99999999999999,
        }]),
    ],
    exports: [
    ],
    controllers: [
        IndexController,
        HealthController,
        AuthController,
        EntryController,
        EntryScenarioController,
        EntryWorkerController,
        TestController,
    ],
    providers: [
        OTPService,
        JwtStrategy,
        RefreshJwtStrategy,
    ],
})
export class ApiModule {}
