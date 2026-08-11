import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'findByEmail'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;

  const plaintextPassword = 'super-secret-1';
  let user: User;

  beforeEach(async () => {
    user = {
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: await bcrypt.hash(plaintextPassword, 10),
      createdAt: new Date(),
    };

    usersService = { findByEmail: jest.fn() };
    jwtService = { signAsync: jest.fn().mockResolvedValue('signed-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) =>
              key === 'JWT_EXPIRES_IN' ? '3600' : 'test-secret',
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('returns a signed session for the right credentials', async () => {
    usersService.findByEmail.mockReturnValue(user);

    const session = await service.login({
      email: user.email,
      password: plaintextPassword,
    });

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { sub: user.id, email: user.email },
      { expiresIn: 3600 },
    );
    expect(session).toEqual({
      accessToken: 'signed-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
    });
  });

  it('rejects an unknown email', async () => {
    usersService.findByEmail.mockReturnValue(undefined);

    await expect(
      service.login({
        email: 'nobody@example.com',
        password: plaintextPassword,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a wrong password with the same message as an unknown email', async () => {
    usersService.findByEmail.mockReturnValue(user);

    await expect(
      service.login({ email: user.email, password: 'wrong-password' }),
    ).rejects.toThrow('Invalid email or password');
  });
});
