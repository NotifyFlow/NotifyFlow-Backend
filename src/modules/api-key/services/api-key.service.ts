import {  Injectable, UnauthorizedException } from "@nestjs/common";
import { ApiKeyRepositoryService } from "../reporsitory/api-key.repository";
import argon2 from "argon2";
import { UserDto } from "src/modules/notifications/dto/user-schema.dto";
import { generateApiKey } from 'src/utils/api-key.generate';




@Injectable()
export class ApiKeyService{

    constructor(private apiKeyRepository:ApiKeyRepositoryService){};

    async checkIfValidApiKey(apiKey:string)
    {
       const prefix = apiKey.slice(0,20);
       const record = await this.apiKeyRepository.getApiKeyByPrefix(prefix);
       if(!record)
            throw new UnauthorizedException("Invalid token");

       const isValid = await argon2.verify(record.hashedKey,apiKey);
       if(!isValid)
        throw new UnauthorizedException("Invalid API Key");
       return record.userId;
    }

    async createToken(userData:UserDto,name:string)
    {
        const {rawKey,prefix,hashedKey} = await generateApiKey();
        await this.apiKeyRepository.storeApiKey(userData.id,name,prefix,hashedKey);
        return rawKey;
    }

    async revokeToken(id:string,userId:string)
    {
        return await this.apiKeyRepository.revokeApi(id,userId);
    }

    async getAllPrefixes(userId:string)
    {
        return this.apiKeyRepository.getAllApiKeys(userId);
    }
}