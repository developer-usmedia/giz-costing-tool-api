import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDTO } from '@api/modules/auth/form/create-user.form';
import { JwtPayload } from '@api/modules/auth/jwt/jwt-payload.type';
import { environment } from '@app/environment';
import { User } from '@domain/entities/user.entity';
import { EmailService } from '@domain/services/email.service';
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
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService,
    ) {}

    public async register(email: string, password: string): Promise<User> {
        const user = CreateUserDTO.toEntity({ email, password });
        const saved = await this.usersService.persist(user);

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

        const updatedUser = await this.usersService.persist(user);

        return await this.sendPasswordResetEmail(updatedUser);
    }

    public async resetPassword(user: User, token: string, newPassword: string): Promise<boolean> {
        const validToken = user.verifyCode(token);

        if (!validToken) {
            return null;
        }

        user.resetPassword(newPassword);
        const saved = await this.usersService.persist(user);

        return !!saved;
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
