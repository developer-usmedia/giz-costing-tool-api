import { environment } from '@common/environment/environment';
import { JwtPayload } from '@common/types/jwt.payload.type';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: environment.jwt.secret,
        });
    }

    // Used by the @UseGuard decorator
    validate(jwtPayload: JwtPayload) {
        // Possible to do extra validation to the jwt provided by the user
        // JWT Payload taken via ExtractJwt.fromAuthHeaderAsBearerToken()

        /**
         * possible extra validations
         * - Do db check for user? (causes db check on easy request)
         * - Do expired check? 
         * - Do blacklist check?
         */

        // For now return the same payload as no extra validation is required
        return jwtPayload;
    }
}
