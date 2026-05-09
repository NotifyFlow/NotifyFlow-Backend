import { DbExecutor } from "src/types/db.types";
import { notificationDeliveries } from "../schema";



export async function createNotificationDeliveries(executor:DbExecutor,notificationId:string,channels:("IN_APP" | "EMAIL" | "PUSH")[])
{
    const values = channels.map((channel)=>({notificationId:notificationId,channel:channel}));
    const deliveries = await executor.insert(notificationDeliveries).values(values).returning();
    return deliveries;
}