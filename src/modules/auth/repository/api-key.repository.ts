import { Injectable } from "@nestjs/common";
import { getUserIdByApiKey } from "src/db/queries/apikeys.query";


@Injectable()
export class ApiKeyRepositoryService{
    async getApiKey(hashedKey:string)
    {
        const userId = await getUserIdByApiKey(hashedKey);
        return userId?.userId;
    }
}