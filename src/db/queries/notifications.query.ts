import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "..";
import { notifications } from "../schema";
import { DbExecutor, Type } from "src/types/db.types";



export async function createNotification(executor:DbExecutor,userId:string,recipientId:string,title:string,body:string,type:Type,idempotencyKey:string,metadata?:JSON|object)
{
    const [notification] = await executor.insert(notifications).values({userId:userId,recipientId:recipientId,title:title,body:body,type:type,idempotencyKey:idempotencyKey,metadata:metadata}).returning();
    return notification;
}

export async function getIdempotencyKey(executor:DbExecutor,idempotencyKey:string,userId:string)
{
    const conditions = [eq(notifications.idempotencyKey,idempotencyKey),eq(notifications.userId,userId)]
    const [notif] = await executor.select().from(notifications).where(and(...conditions));
    return notif;
}

export async function getNotificationsByRecipientId(recipientId:string,offset:number,limit:number,isAsc:boolean)
{
    const notificationS = await db.select().from(notifications).where(eq(notifications.recipientId,recipientId)).orderBy( isAsc ? asc(notifications.createdAt) : desc(notifications.createdAt)).limit(limit??10).offset(offset??0);
    return notificationS;
}

export async function markNotificationAsRead(userId:string, notificationId:string)
{   
    const [notification] = await db.update(notifications).set({isRead:true}).where(and(eq(notifications.userId,userId),eq(notifications.id,notificationId))).returning();
    return notification;
}

export async function markNotificationsAsRead(userId:string,notificationIds:string[]) {
    const readNotifications = await db.update(notifications).set({isRead:true}).where(and(eq(notifications.userId,userId),inArray(notifications.id,notificationIds))).returning();
    return readNotifications;
}

export async function markAllNotificationsReadByRecipientId(recipientId:string,userId:string)
{
    return await db.update(notifications).set({isRead:true}).where(and(eq(notifications.recipientId,recipientId),
                                                                        eq(notifications.userId,userId)
                                                                       ,eq(notifications.isRead,false)),).returning();
}


export async function countUnread(userId:string,recipientId:string)
{
    const unreadCount = await db.select({count:count()}).from(notifications).where(and(eq(notifications.userId,userId),
                                                                                       eq(notifications.isRead,false),
                                                                                       eq(notifications.recipientId,recipientId)));
    return unreadCount;
}