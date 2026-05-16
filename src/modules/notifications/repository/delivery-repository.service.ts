import { Injectable } from "@nestjs/common";
import { createNotificationDeliveries } from "src/db/queries/notificationdelivery.query";
import { DbExecutor } from "src/types/db.types";

@Injectable()
export class DeliverRepositoryService{
    async createDeliveries(notificationId:string,channels:("IN_APP" | "EMAIL" | "PUSH")[],executor?:DbExecutor,status?:string)
    {
        const deliveries = await createNotificationDeliveries(notificationId,channels,executor,status);
        return deliveries;
    }
}   