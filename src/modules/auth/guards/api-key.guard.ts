import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ApiKeyService } from "../services/api-key.service";

@Injectable()
export class ApiKeyGuard implements CanActivate{
    constructor(private apiKeyService:ApiKeyService){};
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpObj = context.switchToHttp();
        const req = httpObj.getRequest<Request>();
        
        const apiKey = req.header('x-api-key');

        if(!apiKey)
            throw new UnauthorizedException("Request doesnt have API key");

        const userId = await this.apiKeyService.checkIfValidApiKey(apiKey);

        if(!userId)
            throw new UnauthorizedException("Invalid API key");

        req["userId"] = userId;

        return true;
    }
}