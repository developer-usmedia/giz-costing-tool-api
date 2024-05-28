import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { AuthService } from '@domain/services/auth.service';
import { UserService } from '@domain/services/user.service';
import { LoginForm } from '../form/login-form.form';

@Injectable()
export class LoginAuthGuard extends AuthGuard('local') implements CanActivate {
    constructor(
        @Inject(UserService) private readonly userService: UserService,
        @Inject(AuthService) private readonly authService: AuthService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        // Validate login request body
        const req = context.switchToHttp().getRequest<Request>();
        const body = await this.validateRequestBody(req);

        // Run check to see if email is verified, if not set it to true using body
        const verified = await this.verifyEmailCode(body);

        // Passport.js login method which sets the cookie in db and on response
        const result = (await super.canActivate(context)) as boolean;
        await super.logIn(req);

        // If false CanActivate will return 403
        return result && verified;
    }

    private async validateRequestBody(req: Request): Promise<LoginForm> {
        // Validate login request body using class-validator
        const body = plainToClass(LoginForm, req.body);
        const errors = await validate(body);
        const errorMessages = errors.flatMap(({ constraints }) => Object.values(constraints));

        if (errorMessages.length > 0) {
            console.debug('Login request body has validation errors');
            throw new BadRequestException(errorMessages);
        }

        return body;
    }

    private async verifyEmailCode(body: LoginForm): Promise<boolean> {
        const user = await this.userService.findOne({ email: body.email });

        if (!user.emailVerified) {
            if (!body.emailVerificationCode) {
                const errorMessage = 'Missing required property emailVerificationCode for verification';
                console.debug(errorMessage);
                throw new BadRequestException(errorMessage);
            }

            // verify emailtoken with db entry and set emailVerified=true if not already verified
            const correct = await this.authService.verifyEmailCode(user, body.emailVerificationCode);
            if (!correct) {
                const errorMessage = 'Invalid email verification code';
                console.debug(errorMessage);
                throw new BadRequestException(errorMessage);
            }
        }

        return true;
    }
}
