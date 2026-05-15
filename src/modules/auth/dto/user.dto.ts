import { IsEmail, IsString, MinLength } from "class-validator";

export class UserDto{
    @IsString()
    @MinLength(1)
    userId:string

    @IsEmail()
    email:string
}