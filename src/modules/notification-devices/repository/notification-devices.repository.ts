import { Injectable } from "@nestjs/common";
import { createUserDevice, refreshFcmTokenByDeviceId, setDeviceInactiveByDeviceId } from "src/db/queries/user-devices.query";
import { PlatformType } from "src/types/db.types";

@Injectable()
export class UserDevicesRepositoryService{
    async createDevice(userId:string,fcmToken:string,platform:PlatformType,recipientId:string,deviceId:string)
    {
        const record = await createUserDevice(userId,fcmToken,platform,recipientId,deviceId);
        return record;
    }

    async refreshFcmTokenByDeviceId(deviceId:string,fcmToken:string)
    {
        return await refreshFcmTokenByDeviceId(deviceId,fcmToken);
    }

    async unregisterDevice(deviceId:string,recipientId:string)
    {
        return await setDeviceInactiveByDeviceId(deviceId,recipientId);
    }
}