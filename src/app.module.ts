import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
  imports: [NotificationsModule,RealtimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
