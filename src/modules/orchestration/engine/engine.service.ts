import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { DeliveryType, NotificationType } from "src/types/db.types";
import { pushQueue } from 'src/infrastructure/queues/push.queue';
import { emailQueue } from 'src/infrastructure/queues/email.queue';
import { inAppQueue } from 'src/infrastructure/queues/inapp.queue';
import { RoutingService } from "../routing/routing.service";
import { DeliverRepositoryService } from "src/modules/notifications/repository/delivery-repository.service";
import { clearWaitingPresenceDelivery, getWaitingPresenceDelivery } from "src/modules/realtime/redis/redis-waiting-presence";
import { setPendingByIds } from "src/db/queries/notificationdelivery.query";


@Injectable()
export class EngineService{
    constructor(private routingService:RoutingService,
                private deliveryRepositoryService:DeliverRepositoryService,
                ){};

    private queueMap = {
                PUSH: pushQueue,
                EMAIL: emailQueue,
                IN_APP: inAppQueue,
                };
    
    async orchestrate(notificaton:NotificationType,channels:("IN_APP"|"PUSH"|"EMAIL")[])
    {
        const smartOrchestration = notificaton.smartOrchestration;
        const recipientId = notificaton.recipientId;
        const finalChannels = (smartOrchestration) ? await      this.routingService.decideBestChannel(recipientId,channels) : await this.routingService.handleManualModeChannels(recipientId,channels,notificaton.id);
        if(!finalChannels)
            throw new BadRequestException("Channels unavailable");
        const deliveries = await this.deliveryRepositoryService.createDeliveries(notificaton.id,finalChannels);
        await this.enqueJobs(deliveries);
    }

    async enqueJobs(deliveries:DeliveryType[]|{channel:string,id:string}[])
    {
         await Promise.all(deliveries.map(async(job)=>{
            const jobName = job.channel;
            const jobQueue = this.queueMap[jobName];
            if(!jobQueue)
                return;
            await jobQueue.add(`SEND_${job.channel}`,{deliveryId:job.id},{attempts:3,backoff:{type:"exponential",delay:5000},removeOnComplete:true});
        }))
        return deliveries;
    }

    async processWaitingForPresence(recipientId:string)
    {
        const deliveryIds = await getWaitingPresenceDelivery(recipientId);
        if(deliveryIds.length === 0)
            return;
        await setPendingByIds(deliveryIds);
        const jobs = deliveryIds.map((id)=>{
            return {
                channel:"IN_APP",
                id:id
            }
        })
        const deliveries = await this.enqueJobs(jobs);
        if(deliveries.length > 0)
            await clearWaitingPresenceDelivery(recipientId);
    }
}