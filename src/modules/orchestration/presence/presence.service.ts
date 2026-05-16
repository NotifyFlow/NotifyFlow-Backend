import { Injectable } from "@nestjs/common";
import { SocketRegistryService } from "src/modules/realtime/registry/socket-registry.service";

@Injectable()
export class PesenceService{
    constructor(private socketRegistry:SocketRegistryService){};

    isOnline(recipientId:string)
    {
        return this.socketRegistry.hasRecipient(recipientId);
    }

}