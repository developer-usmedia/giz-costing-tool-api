import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@api/user/user.module';
import { User } from '@database/entities/user.entity';
import { AuthService } from '@domain/services/auth.service';
import { EmailService } from '@domain/services/email.service';
import { AuthController } from './controller/auth.controller';
import { registerJWT } from './jwt/jwt.module';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
    imports: [
        MikroOrmModule.forFeature([User]),
        PassportModule,
        UserModule,
        registerJWT(),
    ],
    providers: [JwtStrategy, AuthService, EmailService],
    controllers: [AuthController],
})
export class AuthModule {}
