import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserDTO, UserDTOFactory } from '@api/user/dto/user.dto';
import { AuthService } from '@domain/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    // Used by @UseGuard(LocalAuthGuard) decorator
    async validate(email: string, password: string): Promise<UserDTO> {
        try {
            const [user, validCredentials] = await this.authService.login(email, password);

            if (!validCredentials) throw new Error('Invalid credentials');
            if (!user) throw new Error('User not found');

            // This is stored on the session
            const { user: userDto } = UserDTOFactory.fromEntity(user);
            return userDto;
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }
    }
}
