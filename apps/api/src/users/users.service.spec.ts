import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const createUserDto = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'super-secret-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
  });

  describe('create', () => {
    it('stores a hashed password, never the plaintext', async () => {
      const user = await service.create(createUserDto);

      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe(createUserDto.password);
    });

    it('returns a user with an id, name, email and createdAt', async () => {
      const user = await service.create(createUserDto);

      expect(user.id).toEqual(expect.any(String));
      expect(user.name).toBe(createUserDto.name);
      expect(user.email).toBe(createUserDto.email);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('rejects a duplicate email', async () => {
      await service.create(createUserDto);

      await expect(service.create(createUserDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('treats emails as case-insensitively unique', async () => {
      await service.create(createUserDto);

      await expect(
        service.create({
          ...createUserDto,
          email: createUserDto.email.toUpperCase(),
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('finds a user regardless of case', async () => {
      const created = await service.create(createUserDto);

      expect(service.findByEmail(createUserDto.email.toUpperCase())?.id).toBe(
        created.id,
      );
    });

    it('returns undefined when no user matches', () => {
      expect(service.findByEmail('nobody@example.com')).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('finds a user by id', async () => {
      const created = await service.create(createUserDto);

      expect(service.findById(created.id)?.email).toBe(createUserDto.email);
    });

    it('returns undefined when no user matches', () => {
      expect(service.findById('unknown-id')).toBeUndefined();
    });
  });
});
