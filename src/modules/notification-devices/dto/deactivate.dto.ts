import { MinLength } from "class-validator";
import { Type } from "class-transformer";

export class DeactivateDeviceParamDto{
    @IsString()
    @MinLength(1)
    deviceId:string

}