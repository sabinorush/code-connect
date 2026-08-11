import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // Exported so AuthModule (login) and AuthGuard (token verification)
  // can look users up without duplicating access to the repository.
  exports: [UsersService],
})
export class UsersModule {}
