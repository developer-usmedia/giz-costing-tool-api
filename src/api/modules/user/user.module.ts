import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';

import { UserController } from '@api/modules/user/controller/user.controller';
import { DomainModule } from '@domain/domain.module';
import { User } from '@domain/entities/user.entity';
import { AuthService } from '@domain/services/auth.service';
import { EmailService } from '@domain/services/email.service';
import { UserService } from '@domain/services/user.service';

@Module({
    imports: [DomainModule, MikroOrmModule.forFeature([User])],
    providers: [UserService, AuthService, EmailService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
