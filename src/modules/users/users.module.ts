import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepositoryService } from './repository/user.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService,UserRepositoryService]
})
export class UsersModule {}
