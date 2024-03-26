import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';

import { LoginForm } from '@api/modules/auth/form/login-form.form';

@Injectable()
export class LoginAuthGuard extends AuthGuard('local') implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        // Validate login request body using class-validator
        const body = plainToClass(LoginForm, request.body);
        const errors = await validate(body);
        const errorMessages = errors.flatMap(({ constraints }) => Object.values(constraints));

        if (errorMessages.length > 0) {
            response.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                error: 'Bad Request',
                message: errorMessages,
            });
        }

        const result = (await super.canActivate(context)) as boolean;
        await super.logIn(request);

        return result;
    }
}
