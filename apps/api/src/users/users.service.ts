import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

const SALT_ROUNDS = 10;

/**
 * In-memory user store. This is the single place that owns the `users`
 * array — no other class should touch it directly. Swapping this for a
 * real repository (ORM/database) later should only require changes
 * inside this file.
 */
@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user: User = {
      id: randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: await bcrypt.hash(createUserDto.password, SALT_ROUNDS),
      createdAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    const normalized = email.toLowerCase();
    return this.users.find((user) => user.email.toLowerCase() === normalized);
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
