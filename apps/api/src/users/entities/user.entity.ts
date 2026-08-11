import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Persisted representation of a registered user. Deliberately holds
 * `passwordHash`, never the plaintext password — `UsersService` is the
 * only place allowed to read or write this field.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Emails are normalized to lowercase before every read/write in
  // UsersService, so the unique index below is a case-sensitive index
  // over an always-lowercase value — effectively case-insensitive.
  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
