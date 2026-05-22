import { Injectable } from '@nestjs/common';
import { RegisterBodyDto } from '../dto/register.dto';
import { RecipientRepositoryService } from '../../notifications/repository/recipient-repository.service';
import { UserDevicesRepositoryService } from '../repository/notification-devices.repository';
import { RefreshDto } from '../dto/refresh.dto';
import { DeactivateDeviceBodyDto } from '../dto/deactivate.dto';


@Injectable()
export class NotificationDevicesService {
    constructor(private recipientRepositoryService:RecipientRepositoryService,
        private userDeviceRepositoryService:UserDevicesRepositoryService,
        p
    ){};

    async registerFcmToken(userId:string,registerDto:RegisterBodyDto)
    {
        const recipientId = await this.recipientRepositoryService.getRecipientId(userId,registerDto.recipientId);
        const record = await this.userDeviceRepositoryService.createDevice(userId,registerDto.fcmToken,registerDto.platform,recipientId,registerDto.deviceId);
        return record;
    }

    async setDeviceInactiveByDeviceId(userId:string,deactivateDeviceData:DeactivateDeviceBodyDto)
    {
        const recId = await this.recipientRepositoryService.getRecipientId(userId,deactivateDeviceData.recipientId);
        return await this.userDeviceRepositoryService.unregisterDevice(deactivateDeviceData.deviceId,recId);
    }

    async refreshFcmToken(refreshDto:RefreshDto)
    {
        return await this.userDeviceRepositoryService.refreshFcmTokenByDeviceId(refreshDto.deviceId,refreshDto.fcmToken);
    }   
}
