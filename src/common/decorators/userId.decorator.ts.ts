import { JwtPayload } from '@common/types/jwt.payload.type';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    return (request.user as JwtPayload).sub;
});
