import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

// Augment Express' Request so `request.user` is typed at the call site
// (see CurrentUser decorator) instead of relying on `any`.
declare module 'express' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

/**
 * Guard from the Nest "Authentication" documentation chapter: reads the
 * Bearer token off the Authorization header, verifies it with JwtService,
 * and attaches the decoded payload to `request.user`. No Passport
 * involved.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    let payload: { sub: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // The token may be validly signed yet reference a user that no
    // longer exists in memory (e.g. the API restarted). Treat that
    // the same as an invalid token.
    const user = this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    request.user = { id: user.id, email: user.email };
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
