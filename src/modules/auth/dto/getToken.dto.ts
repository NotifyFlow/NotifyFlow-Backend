import { IsSemVer, IsString, MinLength } from "class-validator";


export default class GetTokenDto{
    @IsString()
    @MinLength(1)
    recipientId:string
}