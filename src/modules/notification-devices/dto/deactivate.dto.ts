import { IsString, Min, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class DeactivateDeviceBodyDto{
    @IsString()
    @MinLength(1)
    deviceId:string

    @IsString()
    @MinLength()
    recipientId:string

}