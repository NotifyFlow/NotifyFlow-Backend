import { Injectable } from "@nestjs/common";

@Injectable()
export class SocketRegistryService
{
    private registry = new Map<string,Set<string>>();

    addSocket(recipientId:string,socketId:string)
    {
        let sockets =this.registry.get(recipientId);
        if(!sockets)
        {
            sockets = new Set<string>();
            this.registry.set(
                recipientId,
                sockets
            );
        }
        sockets.add(socketId);
        console.log(
            `[GATEWAY_REGISTRY] Recipient Id: ${recipientId}, socketId:${socketId} registered`
        );
    }

    deleteSocket(socketId:string)
    {
        for(const [recipientId,sockets] of this.registry.entries())
        {
            if(sockets.has(socketId))
            {
                sockets.delete(socketId);
                if(sockets.size === 0){
                    this.registry.delete(recipientId);
                    console.log(`[GATEWAY_REGISTRY] for Recipeint Id: ${recipientId} , socketId:${socketId} is deleted`);
                }
                break;
            }
        }
    }

    getSocketsByRecipientId(recipientId:string)
    {
        return this.registry.get(recipientId);
    }

    hasRecipient(recipientId:string)
    {
        return this.registry.has(recipientId);
    }

    getConnectedRecipientCount()
    {
        return this.registry.size;
    }

    getAllSockets(){}
}