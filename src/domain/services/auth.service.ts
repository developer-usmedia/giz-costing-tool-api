import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { environment } from 'environment';
import { JwtPayload } from '@api/auth';
import { UserCreateForm } from '@api/forms';
import { User } from '@domain/entities';
import { UserService } from '@domain/services';
import { BrevoService } from '@email/brevo.service';

interface JwtToken {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: BrevoService,
        private readonly jwtService: JwtService,
    ) {}

    public async register(email: string, password: string): Promise<User> {
        const user = UserCreateForm.toEntity({ email, password });
        const saved = await this.userService.persist(user);

        await this.sendVerificationEmail(user, false); // Move this to user entity lifecycle

        return saved;
    }

    public login(user: User, password: string): JwtToken {
        const isMatch = user?.comparePasswords(password);

        if (!user || !isMatch) throw new UnauthorizedException('Invalid credentials');

        return this.generateJwt(user, false);
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

        const updatedUser = await this.userService.persist(user);

        return await this.sendPasswordResetEmail(updatedUser);
    }

    public async resetPassword(user: User, token: string, newPassword: string): Promise<boolean> {
        const validToken = user.verifyCode(token);

        if (!validToken) {
            return null;
        }

        user.resetPassword(newPassword);
        const savedUser = await this.userService.persist(user);

        await this.emailService.sendPasswordChangedEmail(savedUser.email);

        return !!savedUser;
    }

    public async sendPasswordResetEmail(user: User): Promise<boolean> {
        return await this.emailService.sendPasswordResetEmail(user.email, user.verificationCode.code);
    }

    public async sendVerificationEmail(user: User, refresh = true): Promise<boolean> {
        if (refresh) {
            user.refreshVerificationCode();
        }

        const saved = await this.userService.persist(user);
        const sent = await this.emailService.sendEmailVerificationEmail(user.email, user.verificationCode.code);
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

        return !!(await this.userService.persist(user));
    }

    public async save2FASecret(user: User, secret: string): Promise<boolean> {
        user.set2FASecret(secret);

        return !!(await this.userService.persist(user));
    }

    public async enable2FA(user: User): Promise<boolean> {
        user.enable2FA();

        return !!(await this.userService.persist(user));
    }

    // TODO: Remove this inbetween step in service. Call user.disable2FA directly?
    public async disable2FA(user: User): Promise<boolean> {
        user.disable2FA();

        return !!(await this.userService.persist(user));
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
