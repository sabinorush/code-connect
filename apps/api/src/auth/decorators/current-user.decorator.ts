import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../auth.guard';

/**
 * Pulls the user populated by AuthGuard off the request, so controllers
 * depend on a typed value instead of reaching into `@Req()` themselves.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // AuthGuard always runs first and always sets `request.user`;
    // the non-null assertion documents that invariant.
    return request.user!;
  },
);
