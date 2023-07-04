import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';

@Module({
  imports: [],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UsersRepository, AuthService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
