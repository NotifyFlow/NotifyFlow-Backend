import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";


export class GetNotificationDto{
    @IsString()
    @MinLength(1)
    recipientId:string

    @Type(()=>Number)
    @IsNumber()
    @Min(1)
    @Max(50)
    @IsOptional()
    limit?:number

    @Type(()=>Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    page?:number

    @IsString()
    @IsOptional()
    orderBy?:"asc"|"desc"
}