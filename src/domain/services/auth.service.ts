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

        await this.sendVerificationEmail(user, false); // Move this to user entity lifecycle

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
        user.refreshVerificationCode();

        const updatedUser = await this.usersService.persist(user);

        return await this.sendPasswordResetEmail(updatedUser);
    }

    public async resetPassword(user: User, token: string, newPassword: string): Promise<boolean> {
        const validToken = user.verifyCode(token);

        if (!validToken) return null;

        user.resetPassword(newPassword);
        const saved = await this.usersService.persist(user);

        return !!saved;
    }

    public async sendPasswordResetEmail(user: User): Promise<boolean> {
        return await this.emailService.sendPasswordResetEmail(user);
    }

    public async sendVerificationEmail(user: User, refresh = true): Promise<boolean> {
        if (refresh) user.refreshVerificationCode();

        const saved = await this.usersService.persist(user);
        const sent = await this.emailService.sendEmailVerificationEmail(user);
        return saved && sent;
    }

    public async verifyEmailCode(user: User, code: string): Promise<boolean> {
        if (user.emailVerfied) return true;

        const validToken = user.verifyCode(code);

        if (!validToken) return false;

        user.verificationCode.reset();
        user.emailVerfied = true;

        return !!(await this.usersService.persist(user));
    }

    public async save2FASecret(user: User, secret: string): Promise<boolean> {
        user.set2FASecret(secret);

        return !!(await this.usersService.persist(user));
    }

    public async enable2FA(user: User): Promise<boolean> {
        user.enable2FA();

        return !!(await this.usersService.persist(user));
    }

    public async disable2FA(user: User): Promise<boolean> {
        user.disable2FA();

        return !!(await this.usersService.persist(user));
    }
}
