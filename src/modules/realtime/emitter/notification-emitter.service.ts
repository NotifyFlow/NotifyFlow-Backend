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
       const deviceMap = this.registry.getSocketsByRecipientId(recipientId);
       console.log(`[EMITTER_SERVICE]for ${recipientId}`);
       if(!deviceMap||deviceMap?.size === 0)
            return;

      for(const [devideId,sockets] of deviceMap)
      {
        sockets.forEach((socket)=>{
          this.gateway.server.to(socket).emit("NEW_NOTIFICATION",payload);
        })
      }
     }
}