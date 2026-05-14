import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { env } from "src/config/env";
import { getRecipientByExternalIdAndUserID } from "src/db/queries/recepients.query";


@Injectable()
export class RealtimeTokenService{
    constructor(private jwtService:JwtService){}

    async generateToken(userId:string,externalRecipientId:string)
    {
        const recipient = await getRecipientByExternalIdAndUserID(externalRecipientId,userId);
        
        const token = await this.jwtService.signAsync({sub:userId,recipientId:recipient.id},{
            secret: env.REALTIME_JWT_SECRET,
            expiresIn: "15m"
        })
        return {token};
    }
}