import { Body, Controller, Param, Post, Patch, UseGuards } from '@nestjs/common';

import { RegisterBodyDto } from '../dto/register.dto';
import { NotificationDevicesService } from '../services/notification-devices.service'
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';
import { User } from '../../notifications/decorators/user.decorator';
import {type UserType } from 'src/types/user.types';
import { DeactivateDeviceParamDto } from '../dto/deactivate.dto';
import { RefreshDto } from '../dto/refresh.dto';

@UseGuards(ApiKeyGuard)
@Controller('notification-devices')
export class NotificationDevicesController {
    constructor(private notificationDeviceRegister:NotificationDevicesService,
                private notificationDeviceService:NotificationDevicesService
    ){};

    @Post('register')
    async register(@User() user:UserType ,@Body() registerDto:RegisterBodyDto)
    {
        return await this.notificationDeviceRegister.registerFcmToken(user.id,registerDto);
    }

    @Post('/refresh')
    async updateRefreshedToken(@User() user:UserType, @Body() refreshDto:RefreshDto)
    {
        return await this.notificationDeviceService.refreshFcmToken(refreshDto);
    }

    @Patch('/:deviceId/deactivate')
    async deactivateDevice(@Param('deviceId') param:DeactivateDeviceParamDto )
    {
        await this.notificationDeviceRegister.setDeviceInactiveByDeviceId(param.deviceId);
    }
}
