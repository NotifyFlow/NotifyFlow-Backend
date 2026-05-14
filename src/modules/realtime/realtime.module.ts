import { Module } from '@nestjs/common';
import { SocketRegistryService } from './registry/socket-registry.service';
import { NotificationWebSocketGateway } from './gateway/notification.gateway';
import { NotificationEmitterService } from './emitter/notification-emitter.service';
import { InAppNotificationSubscribeService } from './subscribe/subsribe.service';

@Module({
    providers:[SocketRegistryService,
              NotificationEmitterService,
              NotificationWebSocketGateway,
              InAppNotificationSubscribeService],
})
export class RealtimeModule {}
