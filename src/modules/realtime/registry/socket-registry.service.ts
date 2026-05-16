import { Injectable } from "@nestjs/common";
import { updateDeviceLastUsed } from "src/db/queries/user-devices.query";

@Injectable()
export class SocketRegistryService
{
    private registry = new Map<string, Map<string, Set<string>>>();

    async addSocket(recipientId:string,socketId:string,deviceId:string)
    {
        let deviceMap =this.registry.get(recipientId);
        if(!deviceMap)
        {
            deviceMap = new Map<string,Set<string>>();
            this.registry.set(recipientId,deviceMap);
        }

        let sockets = deviceMap.get(deviceId);
        if(!sockets)
        {   
            sockets = new Set<string>();
            sockets.add(socketId);
        }

        sockets.add(socketId);
        await updateDeviceLastUsed(recipientId,deviceId);
        console.log(`[GATEWAY_REGISTRY] RecipientId=${recipientId} DeviceId=${deviceId} SocketId=${socketId} registered`);
        
    }
    

    deleteSocket(socketId:string) 
    {
        for(const [recipientId, deviceMap] of this.registry.entries()) 
        {
            for(const [deviceId, sockets] of deviceMap.entries()) {
                if(sockets.has(socketId)) 
                {
                    sockets.delete(socketId);
                    if(sockets.size === 0) 
                        deviceMap.delete(deviceId);
                    if(deviceMap.size === 0) 
                        this.registry.delete(recipientId);
                    console.log(`[GATEWAY_REGISTRY] RecipientId=${recipientId} DeviceId=${deviceId} SocketId=${socketId} deleted`);
                    return;
                }
            }
        }
    }

    getSocketsByRecipientId(recipientId:string)
    {
        return this.registry.get(recipientId);;
    }

    getSocketsByDeviceId(recipientId:string, deviceId:string) 
    {
        return this.registry.get(recipientId)?.get(deviceId);
    }
    
    hasRecipient(recipientId:string)
    {
        return this.registry.has(recipientId);
    }

    hasDevice(recipientId:string, deviceId:string) 
    {
        return this.registry.get(recipientId)?.has(deviceId) ?? false;
    }

    getConnectedRecipientCount()
    {
        return this.registry.size;
    }

    getAllSockets()
    {
        return  this.registry;
    }
}