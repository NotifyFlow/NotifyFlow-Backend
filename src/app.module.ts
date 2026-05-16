import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';

@Module({
  imports: [NotificationsModule,RealtimeModule,UsersModule,AuthModule,ApiKeyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
