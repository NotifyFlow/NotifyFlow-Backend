import { ForbiddenException } from "@nestjs/common";

export class NotRetyableError extends Error{
    constructor(message:string)
    {
        super(message);
        this.name = "NonRetyableError";
    }
}

export class QuotaExceededException extends ForbiddenException{
    constructor(message:string="Monthly notification quota exceeded")
    {
        super(message);
    }
}