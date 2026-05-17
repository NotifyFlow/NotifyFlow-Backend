import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../dto/user-schema.dto';
import { NotificationDto } from '../dto/create-notification.dto';
import { NotificationRepositoryService } from '../repository/notifications-repository.service';
import { RecipientRepositoryService } from '../repository/recipient-repository.service';
import { DeliverRepositoryService } from '../repository/delivery-repository.service';
import { db } from 'src/db';
import { GetNotificationDto } from '../dto/get-notification.dto';
import { ReadBodyDto, ReadParamDto, RecipientDto } from '../dto/update-notifcation.dto';
import { UnreadQueryDto } from '../dto/unread-count.dto';
import { EngineService } from '../../orchestration/engine/engine.service';
import { NotificationType } from 'src/types/db.types';


@Injectable()
export class NotificationsService {
    constructor(private notificationRepositorySerice:NotificationRepositoryService , 
                    private recipientRepositoryService:RecipientRepositoryService
                , private deliveryRepositoryService:DeliverRepositoryService,
                    private engineService:EngineService,
                ){}
    /*
    Okay in this Create notification API, we are doin g these things in series:
        - Checking Idempotency, if a notification exists in the table with the same Idempotency Key, we will return the user's req
        - after checking Idempotency, we are Checking whether the Recipient is in Our DB, if not teh Recipient is Created and then the RecipientId is returned Finally
        - after Getting Recipient Id, a record is created in the Notifications Table
        - After creating the Notifications table, we will get the NotificationId
        - We then update the NotificationDelivery table which tracks whether the notification is been sent through everty channel mentioned by the User.
        - For every channel mentioned by the user, a record is created in the NotificationDelivery
        - Basically, Delivery Status of each notification is stored in this table
        - 
    */ 
    async createNotification(userId:string,notificactionDto:NotificationDto)
    {   
        const idempotencyKey = notificactionDto.idempotencyKey;

        const result = await db.transaction(async(tx)=>{
            const existingNotification = await this.notificationRepositorySerice.notificationExistsByIdempotencyKey(tx,idempotencyKey,userId);
            if(existingNotification)
                return existingNotification;
            const recId = await this.recipientRepositoryService.getRecipientId(userId,notificactionDto.recepientId,tx);    
            const notification = await this.notificationRepositorySerice.createNotification(tx,userId,notificactionDto,recId);
            return {notification,recipientId:recId};
        });   
        
        if(!("recipientId" in result))        
            return result;

        const typedResult = result as {
                                        notification:NotificationType,
                                        recipientId:string
                                    };
        
        const deliveries = await this.engineService.orchestrate(typedResult.notification,notificactionDto.channel);
        
        return {notificaton:typedResult.notification,deliveries};
    }

    /**
     - This endpoint is being Created to return all the notifications sent by a company/developer's app to an recipient
     */
    async getNotifications(userId:string,getNotifDto:GetNotificationDto)
    {
        let offset;
        if(getNotifDto.page !== undefined && getNotifDto.limit !== undefined)
            offset = (getNotifDto.page-1)*getNotifDto.limit;
        const recipientId = await this.recipientRepositoryService.getRecipientId(userId,getNotifDto.recipientId);
        const notifications = await this.notificationRepositorySerice.getNotifications(recipientId,getNotifDto.orderBy,offset,getNotifDto.limit);
        return notifications;
    }

    async markAsRead(userId:string,readParamDto:ReadParamDto)
    {
        const notif = await this.notificationRepositorySerice.markNotificationAsRead(userId,readParamDto.notificationId);
        if(!notif)
            throw new NotFoundException('Application Doesnot own the Notification');
        return notif
    }

    async markmultipleAsRead(userId:string,readBodyDto:ReadBodyDto)
    {
        const readNotifications = await this.notificationRepositorySerice.markMultipleNotificationsAsRead(userId,readBodyDto.notificationIds);
        return readNotifications;
    }

    async markAllNotificationsAsRead(recipientDto:RecipientDto,userId:string)
    {
        return await this.notificationRepositorySerice.markNotificationAsRead(recipientDto.recipientId,userId);
    }

    async getCountUnread(userId:string,unreadDto:UnreadQueryDto)
    {
        const unreadCount = await this.notificationRepositorySerice.getunreadCount(userId,unreadDto.recipientId);
        return unreadCount;
    }

}
