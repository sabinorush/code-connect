import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<Pick<JwtService, 'verifyAsync'>>;
  let usersService: jest.Mocked<Pick<UsersService, 'findById'>>;

  const user: User = {
    id: 'user-1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    passwordHash: 'hashed',
    createdAt: new Date(),
  };

  function contextWithHeader(authorization?: string) {
    const request = { headers: { authorization } } as Request;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;
    return { request, context };
  }

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    usersService = { findById: jest.fn() };
    const configService = {
      getOrThrow: () => 'test-secret',
    } as unknown as ConfigService;

    guard = new AuthGuard(
      jwtService as unknown as JwtService,
      configService,
      usersService as unknown as UsersService,
    );
  });

  it('rejects a request with no Authorization header', async () => {
    const { context } = contextWithHeader(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a header that is not a Bearer token', async () => {
    const { context } = contextWithHeader('Basic abc123');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a token that fails verification', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'));
    const { context } = contextWithHeader('Bearer bad-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a valid token whose user no longer exists', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: user.id,
      email: user.email,
    });
    usersService.findById.mockReturnValue(undefined);
    const { context } = contextWithHeader('Bearer good-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('allows a valid token and attaches the user to the request', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: user.id,
      email: user.email,
    });
    usersService.findById.mockReturnValue(user);
    const { context, request } = contextWithHeader('Bearer good-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({ id: user.id, email: user.email });
  });
});
