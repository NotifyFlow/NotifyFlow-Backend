import { Body, Controller, Get , Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { NotificationDto } from '../dto/create-notification.dto';
import { GetNotificationDto } from '../dto/get-notification.dto';
import { ReadBodyDto, ReadParamDto, RecipientDto } from '../dto/update-notifcation.dto';
import { UnreadQueryDto } from '../dto/unread-count.dto';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';
import { User } from '../decorators/user.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/currentuser.decorator';
import { type UserType } from 'src/types/user.types';




@UseGuards(ApiKeyGuard)
@Controller('notifications')
export class NotificationsController 
{
    constructor(private notificationsService:NotificationsService){};

    @Get()
    async notifications(@Query() getNotifDto:GetNotificationDto, @User() user:UserType)
    {
        return await this.notificationsService.getNotifications(user.id,getNotifDto);
    }

    @Post('/')
    async create(@User() user:UserType, @Body() notificactionDto:NotificationDto)
    {
        return await this.notificationsService.createNotification(user.id,notificactionDto);
    }

    /*
        - This API is for marking the notification as Read, by the Developer/App
        - Checks whether The Tenant owns it, then returns the updated notif, else throws error. 
    */
    @Patch('/:notificationId/read')
    async read(@User() user:UserType, @Param() readParamDto:ReadParamDto)
    {  
        return await this.notificationsService.markAsRead(user.id,readParamDto);
    }

    @Patch('/read')
    async markAsReadMultiple(@User() user:UserType, @Body() readBodyDto:ReadBodyDto)
    {
        return await this.notificationsService.markmultipleAsRead(user.id,readBodyDto);
    }

    @Patch('/all-read')
    async markAllRead(@CurrentUser() @User() user:UserType, @Query() recipientDto:RecipientDto)
    {
        return await this.notificationsService.markAllNotificationsAsRead(recipientDto,user.id);
    }

    @Get('/unread-count')
    async unread(@User() user:UserType, @Query() unreadDto:UnreadQueryDto)
    {
        return await this.notificationsService.getCountUnread(user.id,unreadDto);
    }
}
