export class UnreadQueryDto{
    @IsString()
    @MinLength(1)
    recipientId:string
}