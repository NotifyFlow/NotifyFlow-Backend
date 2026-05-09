import { IsArray, IsString, MinLength } from "class-validator";

export class ReadParamDto{
    @IsString()
    @MinLength(1)
    notificationId:string
}

export class ReadBodyDto{
    @IsArray()
    @MinLength(1)
    notificationIds:string[]   
}

export class RecipientDto{
    @IsString()
    @MinLength(1)
    recipientId:string
}