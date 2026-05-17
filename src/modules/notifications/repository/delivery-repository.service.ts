import { Injectable } from "@nestjs/common";
import { db } from "src/db";
import { createNotificationDeliveries, setSentById } from "src/db/queries/notificationdelivery.query";
import { DbExecutor, DeliveryStatus } from "src/types/db.types";

@Injectable()
export class DeliverRepositoryService{
    async createDeliveries(notificationId:string,channels:("IN_APP" | "EMAIL" | "PUSH")[],executor?:DbExecutor,status?:DeliveryStatus)
    {
        const deliveries = await createNotificationDeliveries(notificationId,channels,executor,status);
        return deliveries;
    }

    async setSentByDeliveryId(deliveryId:string)
    {
        await setSentById(deliveryId);
    }
}   