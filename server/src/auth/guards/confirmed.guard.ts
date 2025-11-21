import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: 'admin' | 'client';
    confirmed?: boolean;
  };
}

@Injectable()
export class ConfirmedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins bypass confirmation check
    if (user.role === 'admin') {
      return true;
    }

    if (!user.confirmed) {
      throw new ForbiddenException(
        'Email verification required. Please verify your email to access this resource.',
      );
    }

    return true;
  }
}
