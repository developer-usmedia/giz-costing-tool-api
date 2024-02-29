import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';

import { User } from '@database/entities/user.entity';
import { DomainModule } from '@domain/domain.module';
import { AuthService, EmailService, UserService } from '@domain/services';
import { UserController } from './controller/user.controller';

@Module({
    imports: [DomainModule, MikroOrmModule.forFeature([User])],
    providers: [UserService, AuthService, EmailService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
