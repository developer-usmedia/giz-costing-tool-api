import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '@database/entities';
import { AuthService } from '@domain/services/auth.service';

// TODO: Explain how this is used in the login process

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
        });
    }

    // Used by the @UseGuard decorator
    async validate(email: string, password: string): Promise<User> {
        try {
            const [user, validCredentials] = await this.authService.login(email, password);

            if (!validCredentials) throw new Error('Invalid credentials');
            if (!user) throw new Error('User not found');

             // Make use of db query and send it to controller in req.user
            return user;
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }
    }
}