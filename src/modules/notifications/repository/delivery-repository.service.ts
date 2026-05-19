import { Injectable } from "@nestjs/common";
import { createNotificationDeliveries, setSentById } from "src/db/queries/notificationdelivery.query";
import { DbExecutor, DeliveryStatus } from "src/types/db.types";

@Injectable()
export class DeliverRepositoryService{
    async createDeliveries(notificationId:string,userId:string,channels:("IN_APP" | "EMAIL" | "PUSH")[],executor?:DbExecutor,status?:DeliveryStatus)
    {
        const deliveries = await createNotificationDeliveries(notificationId,channels,userId,executor,status);
        return deliveries;
    }

    async setSentByDeliveryId(deliveryId:string)
    {
        return await setSentById(deliveryId);
    }
}   