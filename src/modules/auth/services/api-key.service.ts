import {  Injectable, UnauthorizedException } from "@nestjs/common";
import { ApiKeyRepositoryService } from "../repository/api-key.repository";
import crypto from "crypto";


@Injectable()
export class ApiKeyService{

    constructor(private apiKeyRepository:ApiKeyRepositoryService){};

    async checkIfValidApiKey(apiKey:string)
    {
        const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");
        const userId = await this.apiKeyRepository.getApiKey(hashedKey);
        return userId;
    }
}