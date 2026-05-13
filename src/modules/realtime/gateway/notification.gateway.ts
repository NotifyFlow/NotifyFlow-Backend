import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer,SubscribeMessage, ConnectedSocket ,MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketRegistryService } from "../registry/socket-registry.service";

@WebSocketGateway({cors:{origin:"*"}})
export class NotificationWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private registryService:SocketRegistryService){};

    @WebSocketServer()
    server:Server;

    handleConnection(client: Socket) {
        console.log(`[Realtime] Socket connected: ${client.id}`);
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