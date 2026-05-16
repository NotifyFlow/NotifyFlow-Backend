import {IsBoolean, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class NotificationDto{
    @IsString()
    @MinLength(1)
    recepientId:string

    @IsString()
    @MinLength(1)
    title:string

    @IsString()
    @MinLength(1)
    body:string

    @IsString()
    type:"MESSAGE_RECEIVED"|"SYSTEM_ANNOUNCEMENT"|"ACCOUNT_ALERT"|"MARKETPLACE_UPDATE"

    
    channel:("IN_APP"|"EMAIL"|"PUSH")[]

    @IsString()
    @IsOptional()
    metadata?:object|JSON

    @IsString()
    //@IsOptional()
    idempotencyKey:string

    @IsBoolean()
    smartOrchestration:boolean

}