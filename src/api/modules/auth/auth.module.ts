import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@api/modules/auth/controller/auth.controller';
import { OTPService } from '@api/modules/auth/service/otp.service';
import { UserModule } from '@api/modules/user/user.module';
import { environment } from '@app/environment';
import { User } from '@domain/entities/user.entity';
import { AuthService } from '@domain/services/auth.service';
import { EmailService } from '@domain/services/email.service';
import { RefreshJwtStrategy } from './jwt/jwt-refresh.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
    imports: [
        MikroOrmModule.forFeature([User]),
        PassportModule.register({}),
        UserModule,
        JwtModule.register({
            secret: environment.jwt.secret,
            signOptions: { expiresIn: environment.jwt.expiresIn },
        }),
    ],
    providers: [
        AuthService,
        EmailService,
        OTPService,
        JwtStrategy,
        RefreshJwtStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
