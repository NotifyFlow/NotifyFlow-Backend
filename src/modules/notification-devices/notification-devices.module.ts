import { Module } from '@nestjs/common';
import { NotificationDevicesController } from './notification-devices.controller';
import { NotificationDevicesService } from './notification-devices.service';

@Module({
  controllers: [NotificationDevicesController],
  providers: [NotificationDevicesService]
})
export class NotificationDevicesModule {}
