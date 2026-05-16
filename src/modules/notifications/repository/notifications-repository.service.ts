import { Injectable } from "@nestjs/common";
import { NotificationDto } from "../dto/create-notification.dto";
import { UserDto } from "../dto/user-schema.dto";
import { createNotification, getIdempotencyKey, getNotificationsByRecipientId, markAllNotificationsReadByRecipientId, markNotificationAsRead, markNotificationsAsRead } from "src/db/queries/notifications.query";
import { DbExecutor } from "src/types/db.types";
import { countUnread } from "src/db/queries/notifications.query";


@Injectable()
export class NotificationRepositoryService{
    async createNotification(executor:DbExecutor,user:UserDto,notificactionDto:NotificationDto,recId:string)
    {
        const notification = await createNotification(executor,user.id,recId,notificactionDto.title,notificactionDto.body,notificactionDto.type,notificactionDto.idempotencyKey,notificactionDto.smartOrchestration,notificactionDto.metadata);
        return notification;
    }
    
    async notificationExistsByIdempotencyKey(executor:DbExecutor,idempotencyKey:string,userId:string)
    {
        const exisitingNotification = await getIdempotencyKey(executor,idempotencyKey,userId);
        return exisitingNotification;
    }

    async getNotifications(recipientId:string,orderBy?:"asc"|"desc",offset?:number|undefined,limit?:number)
    {
        const notifications = await getNotificationsByRecipientId(recipientId,offset??0,limit??10, orderBy?orderBy==="asc":false);
        return notifications;
    }

    async markNotificationAsRead(userId:string,notificationId:string)
    {
        const notification = await markNotificationAsRead(userId,notificationId);
        return notification;
    }

    async markMultipleNotificationsAsRead(userId:string,notifications:string[])
    {
        return await markNotificationsAsRead(userId,notifications);
    }

    async markAllNotificationsAsRead(recipientId:string,userId:string)
    {
        return await markAllNotificationsReadByRecipientId(recipientId,userId);
    }

    async getunreadCount(userId:string,recipientId:string)
    {
        const unreadCount = await countUnread(userId,recipientId); 
        return unreadCount;
    }
    
}