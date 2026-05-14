import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UsersModule } from '../users/users.module';
import { NotificationDevicesModule } from '../notification-devices/notification-devices.module';
import { DeliverRepositoryService } from './repository/delivery-repository.service';
import { NotificationRepositoryService } from './repository/notifications-repository.service';
import { RecipientRepositoryService } from './repository/recipient-repository.service';


@Module({
  imports:[UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService,DeliverRepositoryService,NotificationRepositoryService,RecipientRepositoryService]
})
export class NotificationsModule {
  
}
