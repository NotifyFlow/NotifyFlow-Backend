import { Injectable } from "@nestjs/common";
import { PesenceService } from "../presence/presence.service";
import { DeliverRepositoryService } from "src/modules/notifications/repository/delivery-repository.service";
import { getLatestLastUsed } from "src/db/queries/user-devices.query";
import { getWaitingPresenceDelivery, storeWaitingPresenceDelivery } from "src/modules/realtime/redis/redis-waiting-presence";

@Injectable()
export class RoutingService{
    constructor(private presenceService:PesenceService,
                private notificationDeliveryRepository:DeliverRepositoryService
    ){}

    async decideBestChannel(recipientId:string,channels:("IN_APP"|"PUSH"|"EMAIL")[]):Promise<("IN_APP"|"PUSH"|"EMAIL")[]>
    {
        const online = this.presenceService.isOnline(recipientId);

        if(channels.includes("IN_APP") && online)
            return ["IN_APP"];

        const lastUsedAt = await getLatestLastUsed(recipientId);
        if(!lastUsedAt)
            throw new Error();
        const inactiveDays = Math.floor((Date.now()-(lastUsedAt?.getTime()/(1000*60*60*24))));

        if( channels.includes("PUSH") && (online  || !online && inactiveDays <= 7) )
            return ["PUSH"];
        else
            return channels.filter((channel)=>channel!=="IN_APP");   
    }

    async handleManualModeChannels(recipientId:string,channels:("IN_APP"|"PUSH"|"EMAIL")[],notifiationId:string):Promise<("IN_APP"|"PUSH"|"EMAIL")[] | undefined>
    {
        const online = this.presenceService.isOnline(recipientId);
        if(!online && channels.includes("IN_APP"))
        {
            const deliveries = await this.notificationDeliveryRepository.createDeliveries(notifiationId,["IN_APP"],undefined,"WAITING_PRESENCE");

            await Promise.all(deliveries.map(async(delivery)=>{
                await storeWaitingPresenceDelivery(recipientId,delivery.id);
            }));

            return channels.filter((channel)=>channel!=="IN_APP");
        }
        else
            return channels;
    }

    

}