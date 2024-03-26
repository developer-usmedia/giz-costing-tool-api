import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GlobalGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (request?.session && !request.session.passport) {
            // Not logged in
            throw new UnauthorizedException();
        }

        return request?.isAuthenticated();
    }
}
