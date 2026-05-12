import { Injectable } from "@nestjs/common";
import { createUserDevice } from "src/db/queries/user-devices.query";
import { PlatformType } from "src/types/db.types";

@Injectable()
export class UserDevicesRepositoryService{
    async createDevice(userId:string,fcmToken:string,platform:PlatformType,recipientId:string,deviceId:string)
    {
        const record = await createUserDevice(userId,fcmToken,platform,recipientId,deviceId);
        return record;
    }
}