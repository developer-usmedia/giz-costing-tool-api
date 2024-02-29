import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@api/user/user.module';
import { User } from '@database/entities/user.entity';
import { AuthService, EmailService, OTPService } from '@domain/services';
import { AuthController } from './controller/auth.controller';
import { LocalStrategy } from './local/local.strategy';
import { SessionSerializer } from './local/session.serializer';

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
        LocalStrategy,
        SessionSerializer,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
