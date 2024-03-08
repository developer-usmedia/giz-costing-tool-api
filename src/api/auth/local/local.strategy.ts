import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@domain/services/auth.service';

export type SessionUser = { id: string };

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    // Used by @UseGuard(LocalAuthGuard) decorator
    async validate(email: string, password: string): Promise<SessionUser> {
        try {
            const [user, validCredentials] = await this.authService.login(email, password);

            if (!validCredentials) throw new Error('Invalid credentials');
            if (!user) throw new Error('User not found');

            // This is stored on the session
            return { id: user.id };
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }
    }
}
