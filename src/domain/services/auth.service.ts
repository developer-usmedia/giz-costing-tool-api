import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from '@api/auth/dto/create-user.dto';
import { User } from '@database/entities/user.entity';
import { EmailService } from './email.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    protected readonly entityName = User;

    constructor(
        protected readonly em: EntityManager,
        protected readonly usersService: UserService,
        private readonly emailService: EmailService,
    ) {}

    public async register(email: string, password: string): Promise<User> {
        const user = CreateUserDTO.toEntity({ email, password });

        return await this.usersService.persist(user);
    }

    public async login(email: string, password: string): Promise<[User, boolean]> {
        const user = await this.usersService.findOne({ email: email }, { populate: ['password'] });

        if (user) {
            const passwordValid = user.comparePasswords(password);
            return [user, passwordValid];
        }

        return [null, false];
    }

    public async startPasswordReset(user: User): Promise<boolean> {
        // TODO: check if email has been verified?
        user.generateAndSetResetToken();

        const updatedUser = await this.usersService.persist(user);

        return await this.sendPasswordResetEmail(updatedUser);
    }

    public async resetPassword(user: User, token: string, newPassword: string): Promise<User | null> {
        const validToken = user.compareResetToken(token);

        if (!validToken) return null;

        user.resetPassword(newPassword);

        return await this.usersService.persist(user);
    }

    public async sendPasswordResetEmail(user: User): Promise<boolean> {
        return await this.emailService.sendPasswordResetEmail(user);
    }
}
