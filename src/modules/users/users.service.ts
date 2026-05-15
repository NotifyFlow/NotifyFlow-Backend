import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from './repository/user.repository';

@Injectable()
export class UsersService {
    constructor(private userRepositoryService:UserRepositoryService){};

    async getUserByGoogleId(userId:string)
    {
        //await getUserByGoogleId(userId);
    }

    async getUserById(userId:string)
    {
        return await this.userRepositoryService.getUser(userId);
    }

}
