import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';

// Deliberately identical whether the email is unknown or the password
// is wrong, so a caller can't use the error message to enumerate
// registered emails.
const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(createSessionDto: CreateSessionDto): Promise<SessionResponseDto> {
    const user = await this.validateCredentials(
      createSessionDto.email,
      createSessionDto.password,
    );
    return this.createSession(user);
  }

  private async validateCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return user;
  }

  private async createSession(user: User): Promise<SessionResponseDto> {
    const expiresIn = Number.parseInt(
      this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
      10,
    );
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn },
    );

    const session = new SessionResponseDto();
    session.accessToken = accessToken;
    session.tokenType = 'Bearer';
    session.expiresIn = expiresIn;
    return session;
  }
}
