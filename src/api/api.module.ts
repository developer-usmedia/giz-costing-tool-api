import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';

import { UserAwareInterceptor } from '@api/nestjs/interceptors/user-aware.interceptor';
import { environment } from '@app/environment';
import { entities } from '@database/mikro-orm.config';
import { DomainModule } from '@domain/domain.module';
import { AuthService } from '@domain/services/auth.service';
import { EmailService } from '@domain/services/email.service';
import { SimulationService } from '@domain/services/simulation.service';
import { UserService } from '@domain/services/user.service';
import { WorkerService } from '@domain/services/worker.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshJwtStrategy } from './auth/jwt/jwt-refresh.strategy';
import { JwtStrategy } from './auth/jwt/jwt.strategy';
import { OTPService } from './auth/service/otp.service';
import { AuthController } from './controllers/auth.controller';
import { SimulationController } from './controllers/simulation.controller';
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
      SimulationController,
    ],
    providers: [
        WorkerService,
        SimulationService,
        UserService,
        AuthService,
        EmailService,
        OTPService,
        JwtStrategy,
        RefreshJwtStrategy,
        {
            provide: APP_INTERCEPTOR,
            useClass: UserAwareInterceptor,
        },
    ],
})
export class ApiModule {}
