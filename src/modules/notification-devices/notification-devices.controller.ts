import { Body, Controller, Post, Req } from '@nestjs/common';
import {type Request } from 'express';
import { RegisterBodyDto } from './dto/register.dto';
import { NotificationDevicesService } from './notification-devices.service';

@Controller('notification-devices')
export class NotificationDevicesController {
    constructor(private notificationDeviceRegister:NotificationDevicesService){};

    @Post('register')
    async register(@Req() req:Request ,@Body() registerDto:RegisterBodyDto)
    {
        //@ts-ignore
        const user  = req.user as UserDto;
        return await this.notificationDeviceRegister.registerFcmToken(user.id,registerDto);
    }
}
