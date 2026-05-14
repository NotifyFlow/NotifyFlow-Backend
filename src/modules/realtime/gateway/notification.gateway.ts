import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer,SubscribeMessage, ConnectedSocket ,MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketRegistryService } from "../registry/socket-registry.service";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { RealtimeAuthService } from "src/modules/auth/services/realtime-auth.service";


@WebSocketGateway({cors:{origin:"*"}})
export class NotificationWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private registryService:SocketRegistryService,
                private webSocketAuthService:RealtimeAuthService
     ){};

    @WebSocketServer()
    server:Server;

    async handleConnection(client: Socket) {
       try{
         const recipientId = await this.webSocketAuthService.validateRealtimeTokens(client);

         if(!recipientId)
            throw new BadRequestException("JWT TOken unaivaiable");

         this.registryService.addSocket(recipientId,client.id);

         console.log(`[REALTIME] Added socket ${client.id} to ${recipientId}`)
       }
       catch(e)
       {
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
        @MessageBody() recipientId:string
    )
    {
        this.registryService.addSocket(
            recipientId,
            client.id
        );

        console.log(
            `[Realtime] Recipient ${recipientId} registered to socket ${client.id}`
        );
    }
}