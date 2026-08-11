import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<Pick<UsersService, 'create' | 'findById'>>;

  const user: User = {
    id: 'user-1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    passwordHash: 'hashed',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        // Never invoked directly in these tests (we call controller
        // methods, bypassing the guard pipeline) — only needed so Nest
        // can resolve AuthGuard's constructor while compiling the
        // module, since `@UseGuards(AuthGuard)` is applied to `getMe`.
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    controller = module.get(UsersController);
  });

  describe('create', () => {
    it('sets the Location header and returns the user without the password hash', async () => {
      usersService.create.mockResolvedValue(user);
      const setHeader = jest.fn();
      const res = { setHeader } as unknown as Response;

      const result = await controller.create(
        { name: user.name, email: user.email, password: 'super-secret-1' },
        res,
      );

      expect(setHeader).toHaveBeenCalledWith('Location', `/users/${user.id}`);
      expect(result).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('getMe', () => {
    it('returns the user matching the authenticated id', () => {
      usersService.findById.mockReturnValue(user);

      const result = controller.getMe({ id: user.id, email: user.email });

      expect(usersService.findById).toHaveBeenCalledWith(user.id);
      expect(result).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });
  });
});
