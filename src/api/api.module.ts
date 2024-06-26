import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';

import { UserAwareInterceptor } from '@api/nestjs/interceptors/user-aware.interceptor';
import { environment } from '@app/environment';
import { entities } from '@database/mikro-orm.config';
import { DomainModule } from '@domain/domain.module';
import { AuthService } from '@domain/services/auth.service';
import { BrevoService } from '@domain/services/email.service';
import { EntryService } from '@domain/services/entry.service';
import { ScenarioService } from '@domain/services/scenario.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshJwtStrategy } from './auth/jwt/jwt-refresh.strategy';
import { JwtStrategy } from './auth/jwt/jwt.strategy';
import { OTPService } from './auth/service/otp.service';
import { AuthController } from './controllers/auth.controller';
import { EntryController } from './controllers/entry.controller';
import { UserController } from './controllers/user.controller';

@Module({
    imports: [
        MikroOrmModule.forFeature(entities), // this should come with domain module
        DomainModule,
        PassportModule.register({}),
        JwtModule.register({
            secret: environment.jwt.secret,
            signOptions: { expiresIn: environment.jwt.expiresIn },
        }),
    ],
    exports: [

    ],
    controllers: [
      AuthController,
      UserController,
      EntryController,
    ],
    providers: [
        WorkerService,
        EntryService,
        UserService,
        AuthService,
        BrevoService,
        OTPService,
        JwtStrategy,
        ScenarioService,
        RefreshJwtStrategy,
        {
            provide: APP_INTERCEPTOR,
            useClass: UserAwareInterceptor,
        },
    ],
})
export class ApiModule {}
