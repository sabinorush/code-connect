import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryFailedError, Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<
    Pick<Repository<User>, 'create' | 'save' | 'findOneBy'>
  >;

  const createUserDto = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'super-secret-1',
  };

  beforeEach(async () => {
    usersRepository = {
      create: jest.fn((entityLike) => entityLike as User),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  describe('create', () => {
    it('stores a hashed password, never the plaintext', async () => {
      usersRepository.save.mockImplementation((user) =>
        Promise.resolve({
          id: 'user-1',
          createdAt: new Date(),
          ...user,
        } as User),
      );

      const user = await service.create(createUserDto);

      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe(createUserDto.password);
    });

    it('returns a user with an id, name, email and createdAt', async () => {
      const createdAt = new Date();
      usersRepository.save.mockImplementation((user) =>
        Promise.resolve({ id: 'user-1', createdAt, ...user } as User),
      );

      const user = await service.create(createUserDto);

      expect(user.id).toBe('user-1');
      expect(user.name).toBe(createUserDto.name);
      expect(user.email).toBe(createUserDto.email);
      expect(user.createdAt).toBe(createdAt);
    });

    it('normalizes the email to lowercase before persisting', async () => {
      usersRepository.save.mockImplementation((user) =>
        Promise.resolve({
          id: 'user-1',
          createdAt: new Date(),
          ...user,
        } as User),
      );

      await service.create({ ...createUserDto, email: 'ADA@EXAMPLE.COM' });

      expect(usersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'ada@example.com' }),
      );
    });

    it('rejects a duplicate email with a 409', async () => {
      usersRepository.save.mockRejectedValue(
        new QueryFailedError('INSERT INTO "users" ...', [], {
          code: '23505',
          message: 'duplicate key value violates unique constraint',
        } as unknown as Error),
      );

      await expect(service.create(createUserDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('rethrows unexpected database errors as-is', async () => {
      const unexpected = new Error('connection lost');
      usersRepository.save.mockRejectedValue(unexpected);

      await expect(service.create(createUserDto)).rejects.toBe(unexpected);
    });
  });

  describe('findByEmail', () => {
    it('queries by the lowercased email', async () => {
      usersRepository.findOneBy.mockResolvedValue(null);

      await service.findByEmail('ADA@EXAMPLE.COM');

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        email: 'ada@example.com',
      });
    });

    it('returns null when no user matches', async () => {
      usersRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.findByEmail('nobody@example.com'),
      ).resolves.toBeNull();
    });
  });

  describe('findById', () => {
    it('finds a user by id', async () => {
      const user = { id: 'user-1', email: createUserDto.email } as User;
      usersRepository.findOneBy.mockResolvedValue(user);

      await expect(service.findById('user-1')).resolves.toBe(user);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-1' });
    });

    it('returns null when no user matches', async () => {
      usersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findById('unknown-id')).resolves.toBeNull();
    });
  });
});
