import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '@api/auth/jwt/jwt-payload.type';
import { UserCreateForm } from '@api/dto/user-create.form';
import { environment } from '@app/environment';
import { User } from '@domain/entities/user.entity';
import { BrevoService } from '@domain/services/email.service';
import { UserService } from '@domain/services/user.service';

interface JwtToken {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    protected readonly entityName = User;

    constructor(
        protected readonly em: EntityManager,
        protected readonly usersService: UserService,
        private readonly emailService: BrevoService,
        private readonly jwtService: JwtService,
    ) {}

    public async register(email: string, password: string): Promise<User> {
        const user = UserCreateForm.toEntity({ email, password });
        const saved = await this.usersService.persist(user);

        await this.sendVerificationEmail(user, false); // Move this to user entity lifecycle

        return saved;
    }

    public validCredentials(user: User, password: string): boolean {
        const isMatch = user?.comparePasswords(password);

        return user && isMatch;
    }

    public generateJwt(user: User, saveRefreshToken = true): JwtToken {
        const token = this.signJwt(user);

        if (saveRefreshToken) {
            user.refreshToken = token.refreshToken;
        }

        return token;
    }

    public async startPasswordReset(user: User): Promise<boolean> {
        user.refreshVerificationCode();

        const updatedUser = await this.usersService.persist(user);

        return await this.sendPasswordResetEmail(updatedUser);
    }

    public async resetPassword(user: User, token: string, newPassword: string): Promise<boolean> {
        const validToken = user.verifyCode(token);

        if (!validToken) {
            return null;
        }

        user.resetPassword(newPassword);
        const savedUser = await this.usersService.persist(user);

        await this.emailService.sendPasswordChangedEmail(savedUser);

        return !!savedUser;
    }

    public async sendPasswordResetEmail(user: User): Promise<boolean> {
        return await this.emailService.sendPasswordResetEmail(user);
    }

    public async sendVerificationEmail(user: User, refresh = true): Promise<boolean> {
        if (refresh) {
            user.refreshVerificationCode();
        }

        const saved = await this.usersService.persist(user);
        const sent = await this.emailService.sendEmailVerificationEmail(user);
        return saved && sent;
    }

    public async verifyEmailCode(user: User, code: string): Promise<boolean> {
        if (user.emailVerified) {
            return true;
        }

        const validToken = user.verifyCode(code);

        if (!validToken) {
            return false;
        }

        user.verificationCode = null;
        user.emailVerified = true;

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

    // TODO: Remove this inbetween step in service. Call user.disable2FA directly?
    public async disable2FA(user: User): Promise<boolean> {
        user.disable2FA();

        return !!(await this.usersService.persist(user));
    }

    private signJwt(user: User): JwtToken {
        const { secret, expiresIn, refreshExpiresIn, issuer } = environment.jwt;
        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            iss: issuer,
        };

        return {
            accessToken: this.jwtService.sign(payload, { secret: secret, expiresIn: expiresIn }),
            refreshToken: this.jwtService.sign(payload, { secret: secret, expiresIn: refreshExpiresIn }),
        };
    }
}
