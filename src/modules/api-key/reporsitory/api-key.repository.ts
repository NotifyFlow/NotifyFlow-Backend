import { Injectable } from "@nestjs/common";
import { getAllPrefixes, getUserIdByPrefix, revokeApiToken, storeApiKey } from "src/db/queries/apikeys.query";


@Injectable()
export class ApiKeyRepositoryService{
    async getApiKeyByPrefix(prefix:string)
    {
        const user =  await getUserIdByPrefix(prefix);
        return user;
    }

    async storeApiKey(userId:string,name:string,prefix:string,hashedKey:string)
    {
        await storeApiKey(userId,hashedKey,prefix,name);
        return;
    }

    async revokeApi(id:string,userId:string)
    {
        return await revokeApiToken(id,userId);
    }

    async getAllApiKeys(userId:string)
    {
        return await getAllPrefixes(userId);
    }
}