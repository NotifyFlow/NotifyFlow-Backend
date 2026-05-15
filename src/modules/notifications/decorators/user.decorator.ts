import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const User = createParamDecorator((data,context:ExecutionContext)=>{
    const request = context.switchToHttp().getRequest<Request>();
    //@ts-ignore
    return {id:request.userId}
})