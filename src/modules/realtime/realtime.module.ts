import { Module } from '@nestjs/common';
import { SocketRegistryService } from './registry/socket-registry.service';
import { NotificationWebSocketGateway } from './gateway/notification.gateway';
import { NotificationEmitterService } from './emitter/notification-emitter.service';
import { InAppNotificationSubscribeService } from './subscribe/subsribe.service';
import { AuthModule } from '../auth/auth.module';
import { RealtimeAuthService } from '../auth/services/realtime-auth.service';

@Module({
    imports:[AuthModule,RealtimeAuthService],
    providers:[SocketRegistryService,
              NotificationEmitterService,
              NotificationWebSocketGateway,
              InAppNotificationSubscribeService],
})
export class RealtimeModule {}
