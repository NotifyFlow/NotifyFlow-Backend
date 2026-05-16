import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { RegisterBodyDto } from './dto/register.dto';
import { NotificationDevicesService } from './notification-devices.service';
import { AuthGaurd } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/currentuser.decorator';
import {type CurrentUserType } from 'src/types/db.types';

@Controller('notification-devices')
export class NotificationDevicesController {
    constructor(private notificationDeviceRegister:NotificationDevicesService){};

    @Post('register')
    @UseGuards(AuthGaurd)
    async register(@CurrentUser() user:CurrentUserType ,@Body() registerDto:RegisterBodyDto)
    {

        return await this.notificationDeviceRegister.registerFcmToken(user.userId,registerDto);
    }
}
