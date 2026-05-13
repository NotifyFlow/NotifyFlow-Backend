import { Injectable } from "@nestjs/common";
import { SocketRegistryService } from "../registry/socket-registry.service";
import { NotificationWebSocketGateway } from "../gateway/notification.gateway";

@Injectable()
export class NotificationEmitterService{
    constructor(private registry:SocketRegistryService,
        private gateway:NotificationWebSocketGateway
    ){};


     emittor(recipientId:string,payload:any)
     {
       const sockets = this.registry.getSocketsByRecipientId(recipientId);

       if(!sockets||sockets?.size === 0)
            return;
       
       sockets?.forEach((socketId)=>{
        this.gateway.server.to(socketId).emit("NEW_NOTIFICATION",payload);
       });
     }
}