import { EntityManager } from '@mikro-orm/postgresql';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { User } from '@domain/entities';
import { MikroFilters } from '@domain/database';

export type UserAwareArgs = { enable: boolean; userId: string };

@Injectable()
export class UserAwareInterceptor implements NestInterceptor {
    private readonly logger = new Logger(UserAwareInterceptor.name);

    constructor(private readonly em: EntityManager) {}

    public isUserAware(request: Request): UserAwareArgs {
        const user = request.user as User;
        const userId = user?.id ?? '-1';

        // Optionally check origin or role of user
        return { enable: true, userId: userId };
    }

    public intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const request: Request = ctx.switchToHttp().getRequest();
        const userAware = this.isUserAware(request);

        if (userAware.enable) {
            this.logger.verbose('UserAware Enabled');
        } else {
            this.logger.verbose('UserAware Disabled');
        }

        this.em.setFilterParams(MikroFilters.USER_AWARE, userAware);

        return next.handle();
    }
}
