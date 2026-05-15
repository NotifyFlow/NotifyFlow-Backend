import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {type Request } from "express";
import { env } from "src/config/env";

@Injectable()
export class AuthGaurd implements CanActivate{
    constructor(private jwtService:JwtService){};

    async canActivate(context: ExecutionContext): Promise<boolean> 
    {
        const httpObj = context.switchToHttp();
        const request = httpObj.getRequest<Request>();
        const authorizationHeader = request.headers.authorization;

        if(!authorizationHeader)
            throw new UnauthorizedException("Missing Authurization Header");
        const [bearer,token] = authorizationHeader.split(' ',2);

        if(bearer!=="Bearer" || !token)
            throw new UnauthorizedException("Invalid Authorization header");

        const payload = await this.jwtService.verifyAsync(token,{secret:env.JWT_SECRET});
        request['userId'] = payload.sub;
        request['email'] = payload.email;
        return true;
    }
}