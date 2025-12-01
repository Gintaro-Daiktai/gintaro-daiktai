import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../interfaces/user_payload.interface';

type UserPayloadKey = keyof UserPayload;

export const User = createParamDecorator(
  (data: UserPayloadKey | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user: UserPayload = request.user as UserPayload;

    if (!user) {
      return null;
    }

    if (data) {
      return user[data];
    }
    return user;
  },
);
