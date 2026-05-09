import { Injectable } from "@nestjs/common";
import { createNotificationDeliveries } from "src/db/queries/notificationdelivery.query";
import { DbExecutor } from "src/types/db.types";

@Injectable()
export class DeliverRepositoryService{
    async createDeliveries(executor:DbExecutor,notificationId:string,channels:("IN_APP" | "EMAIL" | "PUSH")[])
    {
        const deliveries = await createNotificationDeliveries(executor,notificationId,channels);
        return deliveries;
    }
}   