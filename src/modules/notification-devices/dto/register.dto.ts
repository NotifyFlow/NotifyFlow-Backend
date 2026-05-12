import { IsString, Length, MinLength } from "class-validator";
import {type PlatformType } from "src/types/db.types";

export class RegisterBodyDto{
    @IsString()
    @MinLength(2)
    recipientId:string

    @IsString()
    @Length(1,512)
    fcmToken:string

    @IsString()
    @Length(1,512)
    deviceId:string

    @IsString()
    platform:PlatformType

    
}