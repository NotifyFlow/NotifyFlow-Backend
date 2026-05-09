import { IsString, MinLength } from "class-validator"

export class UnreadQueryDto{
    @IsString()
    @MinLength(1)
    recipientId:string
}