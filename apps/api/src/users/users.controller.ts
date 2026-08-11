import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User created', type: UserResponseDto })
  @ApiConflictResponse({ description: 'Email already registered' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    res.setHeader('Location', `/users/${user.id}`);
    return UserResponseDto.fromEntity(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiOkResponse({ description: 'The logged-in user', type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' })
  async getMe(
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    // AuthGuard just confirmed this user exists (and there is no
    // delete endpoint that could remove it in between), so the
    // non-null assertion is safe here.
    const user = (await this.usersService.findById(currentUser.id))!;
    return UserResponseDto.fromEntity(user);
  }
}
