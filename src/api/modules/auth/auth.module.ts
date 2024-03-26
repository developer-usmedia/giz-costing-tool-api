import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@api/modules/auth/controller/auth.controller';
import { LoginStrategy } from '@api/modules/auth/login/login.strategy';
import { SessionSerializer } from '@api/modules/auth/login/session.serializer';
import { OTPService } from '@api/modules/auth/service/otp.service';
import { UserModule } from '@api/modules/user/user.module';
import { User } from '@domain/entities/user.entity';
import { AuthService } from '@domain/services/auth.service';
import { EmailService } from '@domain/services/email.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([User]),
        PassportModule.register({ session: true }),
        UserModule,
    ],
    providers: [
        AuthService,
        EmailService,
        OTPService,
        LoginStrategy,
        SessionSerializer,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
