/**
 * In-memory representation of a registered user. Deliberately holds
 * `passwordHash`, never the plaintext password — `UsersService` is the
 * only place allowed to read or write this field.
 */
export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
