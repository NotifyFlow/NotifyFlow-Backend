import { IsString, MinLength } from "class-validator";

export class ReadParamDto{
    @IsString()
    @MinLength(1)
    notificationId:string
}