import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

/**
 * Public representation of a User. `passwordHash` is intentionally
 * omitted — always build this via `fromEntity` rather than spreading
 * the entity, so a leak can't be introduced by adding a field to
 * `User` and forgetting to strip it here.
 */
export class UserResponseDto {
  @ApiProperty({ example: '2f9b6f3e-19c8-4e2a-9d3f-6b6a3a2f9c11' })
  id: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  name: string;

  @ApiProperty({ example: 'ada@example.com' })
  email: string;

  @ApiProperty({ example: '2026-08-11T12:00:00.000Z' })
  createdAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
