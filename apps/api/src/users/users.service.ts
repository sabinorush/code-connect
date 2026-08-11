import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

const SALT_ROUNDS = 10;

// Postgres error code for a unique-constraint violation.
const UNIQUE_VIOLATION = '23505';

/**
 * Persists users through the `users` table via TypeORM. This is the
 * single place that talks to the `usersRepository` — no other class
 * should inject it directly.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email.toLowerCase(),
      passwordHash: await bcrypt.hash(createUserDto.password, SALT_ROUNDS),
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email.toLowerCase() });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError & { code?: string }).code === UNIQUE_VIOLATION
  );
}
