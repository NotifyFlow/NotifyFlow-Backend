import { MinLength } from "class-validator";

export class RefreshDto{
   
    @IsString()
    @MinLength(1)
    fcmToken:string

    @IsString()
    @MinLength(1)
    deviceId:string
}