import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user-schema.dto';
import { NotificationDto } from './dto/create-notification.dto';
import { NotificationRepositoryService } from './repository/notifications-repository.service';
import { RecipientRepositoryService } from './repository/recipient-repository.service';
import { DeliverRepositoryService } from './repository/delivery-repository.service';
import { db } from 'src/db';
import { GetNotificationDto } from './dto/get-notification.dto';
import { ReadParamDto } from './dto/update-notifcation.dto';
import { countUnread } from 'src/db/queries/notifications.query';
import { UnreadQueryDto } from './dto/unread-count.dto';


@Injectable()
export class NotificationsService {
    constructor(private notificationRepositorySerice:NotificationRepositoryService , 
                    private recipientRepositoryService:RecipientRepositoryService
                , private deliveryRepositoryService:DeliverRepositoryService){}
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
    async createNotification(user:UserDto,notificactionDto:NotificationDto)
    {   
        const idempotencyKey = notificactionDto.idempotencyKey;
        const res = await db.transaction(async(tx)=>{
            const existingNotification = await this.notificationRepositorySerice.notificationExistsByIdempotencyKey(tx,idempotencyKey,user.id);
            if(existingNotification)
                return existingNotification;
            const recId = await this.recipientRepositoryService.getRecipientId(user.id,notificactionDto.recepientId,tx);
            const notification = await this.notificationRepositorySerice.createNotification(tx,user,notificactionDto,recId);
            const deliveries = await this.deliveryRepositoryService.createDeliveries(tx,notification.id,notificactionDto.channel);
            return {notification,deliveries};
        });   
        return res;     
    }

    /**
     - This endpoint is being Created to return all the notifications sent by a company/developer's app to an recipient
     */
    async getNotifications(userDto:UserDto,getNotifDto:GetNotificationDto)
    {
        let offset;
        if(getNotifDto.page !== undefined && getNotifDto.limit !== undefined)
            offset = (getNotifDto.page-1)*getNotifDto.limit;
        const recipientId = await this.recipientRepositoryService.getRecipientId(userDto.id,getNotifDto.recipientId);
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

    async getCountUnread(userId:string,unreadDto:UnreadQueryDto)
    {
        const unreadCount = await this.notificationRepositorySerice.getunreadCount(userId,unreadDto.recipientId);
        return unreadCount;
    }

}
