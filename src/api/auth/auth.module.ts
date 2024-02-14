import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@api/user/user.module';
import { environment } from '@common/environment/environment';
import { User } from '@database/entities/user.entity';
import { AuthService } from '@domain/services/auth.service';
import { EmailService } from '@domain/services/email.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
    imports: [
        MikroOrmModule.forFeature([User]),
        PassportModule,
        UserModule,
        JwtModule.register({
            secret: environment.jwt.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [JwtStrategy, AuthService, EmailService],
    controllers: [AuthController],
})
export class AuthModule {}
