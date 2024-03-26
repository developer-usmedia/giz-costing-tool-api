import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { SessionUser } from '@api/modules/auth/login/login.strategy';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): SessionUser => {
    // local.strategy defines what is stored in the session.
    const request = ctx.switchToHttp().getRequest();

    return request.user as SessionUser;
});
