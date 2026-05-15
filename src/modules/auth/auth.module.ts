import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import {JwtModule} from "@nestjs/jwt"
import { UsersModule } from '../users/users.module';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports:[JwtModule.register({}),UsersModule,ApiKeyModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
