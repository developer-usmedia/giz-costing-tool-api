import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { environment } from 'environment';
import { JwtPayload } from './jwt-payload.type';

export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: environment.jwt.secret,
            ignoreExpiration: true,
            passReqToCallback: true,
        });
    }

    validate(request: Request, payload: JwtPayload) {
        // Possible improvement -> use joi or class-validator to unify error messages across endpoints
        const refreshToken = (request.body as any)?.refreshToken;

        if (!refreshToken) {
            throw new BadRequestException('Missing refreshToken in body');
        }

        return payload;
    }
}
