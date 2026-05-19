import { ForbiddenException } from "@nestjs/common";

export class NotRetryableError extends Error
{
    constructor(message:string,public providerErrorCode?:string)
    {
        super(message);
        this.name = "NotRetryableError";
    }
}

export class QuotaExceededException extends ForbiddenException{
    constructor(message:string="Monthly notification quota exceeded")
    {
        super(message);
    }
}