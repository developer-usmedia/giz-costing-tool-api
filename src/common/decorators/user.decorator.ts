import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { SessionUser } from '@api/auth/local/local.strategy';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): SessionUser => {
    // local.strategy defines what is stored in the session.
    const request = ctx.switchToHttp().getRequest();

    return request.user as SessionUser;
});
