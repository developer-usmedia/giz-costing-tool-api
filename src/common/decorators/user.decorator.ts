import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserDTO } from '@api/user/dto/user.dto';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): UserDTO => {
    // local.strategy defines what is stored in the session.
    const request = ctx.switchToHttp().getRequest();

    return request.user as UserDTO;
});
