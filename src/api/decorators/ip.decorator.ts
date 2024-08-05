import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getClientIp } from '@supercharge/request-ip';

export const Ip = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return getClientIp(request);
});