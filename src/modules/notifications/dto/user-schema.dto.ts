    import { IsEmail, isString, IsString, MinLength } from "class-validator";



    export class UserDto{
        @IsString()
        id:string

        @IsString()
        @MinLength(1)
        username:string

        // @IsEmail()
        // email:string

        // @IsString()
        // subscriptionTier:string
    }