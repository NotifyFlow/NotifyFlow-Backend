import { Injectable } from "@nestjs/common";

@Injectable()
export class SocketRegistryService
{
    private registry = new Map<string,Set<string>>();

    addSocket(recipientId:string,socketId:string)
    {
        if(this.registry.has(recipientId))
        {   
            this.registry.get(recipientId)?.add(socketId);
        }
        else
        {
            this.registry.set(recipientId,new Set<string>());
        }
    }

    deleteSocket(socketId:string)
    {
        for(const [recipientId,sockets] of this.registry.entries())
        {
            if(sockets.has(socketId))
            {
                sockets.delete(socketId);
                if(sockets.size === 0)
                    this.registry.delete(recipientId);
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