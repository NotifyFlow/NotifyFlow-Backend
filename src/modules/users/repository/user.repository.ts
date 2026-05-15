import {  Injectable } from "@nestjs/common";
import { getUserByGoogleId, getUserById } from "src/db/queries/user.query";

@Injectable()
export class UserRepositoryService{
    async getUserByGoogleId(googleId:string)
    {
        return await getUserByGoogleId(googleId);
    }

    async getUser(userId:string)
    {
        return await getUserById(userId);
    }
}