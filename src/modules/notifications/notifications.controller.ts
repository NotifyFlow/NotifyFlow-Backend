import { Body, Controller, Get , Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {type Request } from 'express';
import { UserDto } from './dto/user-schema.dto';
import { NotificationDto } from './dto/create-notification.dto';
import { GetNotificationDto } from './dto/get-notification.dto';
import { ReadBodyDto, ReadParamDto, RecipientDto } from './dto/update-notifcation.dto';
import { UnreadQueryDto } from './dto/unread-count.dto';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { User } from './decorators/user.decorator';




@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService:NotificationsService){};
    @Get()
    @UseGuards(ApiKeyGuard)
    async notifications(@Query() getNotifDto:GetNotificationDto, @User() user:{id:string})
    {
        //@ts-ignore
       
        return await this.notificationsService.getNotifications(user.id,getNotifDto);
    }

    @Post('/')
    async create(@Req() req:Request, @Body() notificactionDto:NotificationDto)
    {
        //@ts-ignore
        const user  = {
            id:"187626c8-4559-42ff-9613-10d24fd707c8",
            username:"anirudh"
        };
        return await this.notificationsService.createNotification(user,notificactionDto);
    }

    /*
        - This API is for marking the notification as Read, by the Developer/App
        - Checks whether The Tenant owns it, then returns the updated notif, else throws error. 
    */
    @Patch('/:notificationId/read')
    async read(@Req() req:Request, @Param() readParamDto:ReadParamDto)
    {
        //@ts-ignore
        const user  = req.user as UserDto;
        return await this.notificationsService.markAsRead(user.id,readParamDto);
    }

    @Patch('/read')
    async markAsReadMultiple(@Req() req:Request, @Body() readBodyDto:ReadBodyDto)
    {
        //@ts-ignore
        const user  = req.user as UserDto;
        return await this.notificationsService.markmultipleAsRead(user.id,readBodyDto);
    }

    @Patch('/all-read')
    async markAllRead(@Req() req:Request, @Query() recipientDto:RecipientDto)
    {
        //@ts-ignore
        const user:UserDto = req.user;
        return await this.notificationsService.markAllNotificationsAsRead(recipientDto,user.id);
    }

    @Get('/unread-count')
    async unread(@Req() req:Request, @Query() unreadDto:UnreadQueryDto)
    {
        //@ts-ignore
        const user  = req.user as UserDto;
        return await this.notificationsService.getCountUnread(user.id,unreadDto);
    }
}
