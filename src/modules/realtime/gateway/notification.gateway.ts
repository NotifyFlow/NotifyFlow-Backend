import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer,SubscribeMessage, ConnectedSocket ,MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketRegistryService } from "../registry/socket-registry.service";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { RealtimeAuthService } from "src/modules/auth/services/realtime-auth.service";
import { EngineService } from "src/modules/orchestration/engine/engine.service";


@WebSocketGateway({cors:{origin:"*"}})
export class NotificationWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private registryService:SocketRegistryService,
                private webSocketAuthService:RealtimeAuthService,
                private engineService:EngineService
     ){};

    @WebSocketServer()
    server:Server;

    async handleConnection(client: Socket) {
       try{
         const {recipientId,deviceId} = await this.webSocketAuthService.validateRealtimeTokens(client);

         if(!recipientId)
            throw new BadRequestException("JWT TOken unaivaiable");

         await this.registryService.addSocket(recipientId,client.id,deviceId);
         console.log(`[REALTIME] Added socket ${client.id} to ${recipientId}`);
         await this.engineService.processWaitingForPresence(recipientId);
       }
       catch(e)
       {
        console.error(e);
        client.disconnect()
       }
    }

    handleDisconnect(client: Socket) {
        this.registryService.deleteSocket(client.id);
        console.log(`[Realtime] Socket disconnected: ${client.id}`)
    }

    @SubscribeMessage("REGISTER_RECIPIENT")
    registerRecipient(
        @ConnectedSocket() client:Socket,
        @MessageBody() data:{recipientId:string,deviceId:string}
    )
    {
        this.registryService.addSocket(
            data.recipientId,
            client.id,
            data.deviceId
        );

        console.log(
            `[Realtime] Recipient ${data.recipientId} registered to socket ${client.id}`
        );
    }

    @SubscribeMessage("NOTIFICATION_ACK")
    async acknowledgeNotification( @ConnectedSocket() client:Socket, @MessageBody() data:{deliveryId:string})
    {
        try{
            await this.engineService.markSent(data.deliveryId);

            client.emit("ACKNOLEDGEMENT_RECIEVED",{deliveryId:data.deliveryId});

            console.log(`[Realtime ACK] Delivery ${data.deliveryId} acknowledged`);
        }
        catch(e)
        {
            console.log(`[Realtime ACK ERROR]: `,e);
        }
    }
}