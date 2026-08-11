import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // Exported so AuthModule (login) and AuthGuard (token verification)
  // can look users up without duplicating the in-memory store.
  exports: [UsersService],
})
export class UsersModule {}
