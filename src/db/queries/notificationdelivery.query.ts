import { DbExecutor } from "../../types/db.types";
import { notificationDeliveries } from "../schema/schema";
import { db } from "..";
import { and, eq ,inArray} from "drizzle-orm";



export async function createNotificationDeliveries(notificationId:string,channels:("IN_APP" | "EMAIL" | "PUSH")[],executor?:DbExecutor,status?:string)
{
    const values = channels.map((channel)=>({notificationId:notificationId,channel:channel,status:status??"PENDING"}));
    const deliveries = await (executor ?? db).insert(notificationDeliveries).values(values).returning();
    return deliveries;
}

export async function claimPendingDelivery(deliveryId:string)
{
    const [delivery] = await db.update(notificationDeliveries).set({status:"PROCESSING"}).where(and(eq(notificationDeliveries.id,deliveryId),eq(notificationDeliveries.status,"PENDING"))).returning();
    return delivery;
}

export async function setSentById(deliveryId:string)
{
    const [delivery] = await db.update(notificationDeliveries).set({status:"SENT"}).where(and(eq(notificationDeliveries.id,deliveryId),eq(notificationDeliveries.status,"PROCESSING"))).returning();
    //return delivery;
}

export async function setFailedById(deliveryId:string)
{
    const [delivery] = await db.update(notificationDeliveries).set({status:"FAILED"}).where(and(eq(notificationDeliveries.id,deliveryId),eq(notificationDeliveries.status,"SENT"))).returning();
    return delivery;
}

export async function setPendingById(deliveryId:string)
{
    const [delivery] = await db.update(notificationDeliveries).set({status:"PENDING"}).where(and(eq(notificationDeliveries.id,deliveryId),eq(notificationDeliveries.status,"PROCESSING"))).returning();
    return delivery;
}

export async function setPendingByIds(deliveryIds:string[])
{
    await db.update(notificationDeliveries).set({status:"PENDING"}).where(inArray(notificationDeliveries.id,deliveryIds));
}
