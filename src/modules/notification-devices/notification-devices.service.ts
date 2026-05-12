import { Injectable } from '@nestjs/common';
import { RegisterBodyDto } from './dto/register.dto';
import { RecipientRepositoryService } from '../notifications/repository/recipient-repository.service';
import { UserDevicesRepositoryService } from './repository/notification-devices.repository';


@Injectable()
export class NotificationDevicesService {
    constructor(private recipientRepositoryService:RecipientRepositoryService,
        private userDeviceRepositoryService:UserDevicesRepositoryService
    ){};

    async registerFcmToken(userId:string,registerDto:RegisterBodyDto)
    {
        const recipientId = await this.recipientRepositoryService.getRecipientId(userId,registerDto.recipientId);
        const record = await this.userDeviceRepositoryService.createDevice(userId,registerDto.fcmToken,registerDto.platform,recipientId,registerDto.deviceId);
        return record;
    }
}
