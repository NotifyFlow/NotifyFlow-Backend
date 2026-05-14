import { Module } from '@nestjs/common';
import { NotificationDevicesController } from './notification-devices.controller';
import { NotificationDevicesService } from './notification-devices.service';
import { RecipientRepositoryService } from '../notifications/repository/recipient-repository.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports:[NotificationsModule,RecipientRepositoryService],
  controllers: [NotificationDevicesController],
  providers: [NotificationDevicesService]
})
export class NotificationDevicesModule {}
