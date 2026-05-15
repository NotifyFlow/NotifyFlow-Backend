import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator((data,context:ExecutionContext)=>{

    const request = context.switchToHttp().getRequest<Request>();
    //@ts-ignore
    return {userId:request.userId,email:request.email};
})