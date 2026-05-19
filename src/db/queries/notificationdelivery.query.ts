import { DbExecutor, DeliveryStatus } from "../../types/db.types";
import { notificationDeliveries } from "../schema/schema";
import { db } from "..";
import { and,sql, eq ,inArray} from "drizzle-orm";



export async function createNotificationDeliveries(notificationId:string,channels:("IN_APP" | "EMAIL" | "PUSH")[],userId:string,executor?:DbExecutor,status?:DeliveryStatus)
{
    const values = channels.map((channel)=>({notificationId:notificationId,channel:channel,userId,status:status??"PENDING"}));
    const deliveries = await (executor ?? db).insert(notificationDeliveries).values(values).returning();
    return deliveries;
}


export async function claimPendingDelivery(deliveryId:string)
{
    const [delivery] = await db.update(notificationDeliveries).set({status:"PROCESSING"}).where(and(eq(notificationDeliveries.id,deliveryId),eq(notificationDeliveries.status,"PENDING"))).returning();
    return delivery;
}

export async function setSentById(deliveryId:string,provider:string,providerMessageId?:string)
{
    const [delivery] = await db.update(notificationDeliveries).set({status:"SENT",sentAt: new Date(), provider:provider,providerMessageId}).where(and(eq(notificationDeliveries.id,deliveryId),inArray(notificationDeliveries.status,["PROCESSING","PUBLISHED"]))).returning();
    return delivery;
}

export async function setPublishedById(deliveryId:string,provider:string)
{
    await db.update(notificationDeliveries).set({status:"PUBLISHED",provider}).where(and(eq(notificationDeliveries.id,deliveryId),eq(notificationDeliveries.status,"PROCESSING")));
    return;
}

export async function setFailedById(deliveryId:string,errorMessage:string,provider?:string,providerErrorCode?:string)
{
    const [delivery] = await db.update(notificationDeliveries).set({status:"FAILED",provider,providerErrorCode,errorMessage}).where(and(eq(notificationDeliveries.id,deliveryId),inArray(notificationDeliveries.status,["PUBLISHED","PROCESSING"]))).returning();
    return delivery;
}

export async function setPendingById(deliveryId:string,providerMessageId?:string)
{
    const [delivery] = await db.update(notificationDeliveries).set({status:"PENDING",providerMessageId, retryCount: sql`${notificationDeliveries.retryCount}+1`}).where(and(eq(notificationDeliveries.id,deliveryId),eq(notificationDeliveries.status,"PROCESSING"))).returning();
    return delivery;
}

export async function setPendingByIds(deliveryIds:string[])
{
    await db.update(notificationDeliveries).set({status:"PENDING"}).where(inArray(notificationDeliveries.id,deliveryIds));
}


//DB Query calls used by cleanup inapp worker.
export async function getStalePublishedDelivery()
{
    return await db.query.notificationDeliveries.findMany({where: and(eq(notificationDeliveries.status,"PUBLISHED"),sql`updated_at < NOW() - interval '15 seconds'`)})  
}

export async function retryPublishedInAppDelivery(deliveryId:string)
{   
    await db.update(notificationDeliveries).set({status:"PENDING",retryCount: sql`${notificationDeliveries.retryCount}+1`}).where(and(eq(notificationDeliveries.id,deliveryId),eq(notificationDeliveries.status,"PUBLISHED")));
    return;
}




