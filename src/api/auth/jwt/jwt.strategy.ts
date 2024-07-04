import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { environment } from 'environment';
import { UserService } from '@domain/services';
import { JwtPayload } from './jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: environment.jwt.secret,
            ignoreExpiration: false,
        });
    }

    // Executed when the JwtGuard is set on endpoint
    async validate(jwtPayload: JwtPayload) {
        // https://docs.nestjs.com/recipes/passport#jwt-functionality:~:text=first%20verifies%20the%20JWT%27s%20signature
        // Passportjs has already verified the signature
        if (!jwtPayload) {
            throw new UnauthorizedException();
        }

        const user = await this.userService.findOne({ email: jwtPayload.email });

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        if (jwtPayload.userId !== user.id) {
            throw new ForbiddenException('Invalid jwt subject');
        }

        if (jwtPayload.iss !== environment.jwt.issuer) {
            throw new ForbiddenException('Invalid jwt issuer');
        }

        // This is stored on the request in req.user
        return user;
    }
}
