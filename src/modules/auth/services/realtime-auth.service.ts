import { BadRequestException, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { env } from "src/config/env";

@Injectable()
export class RealtimeAuthService{

    constructor(private jwtService:JwtService){};

    async validateRealtimeTokens(client:Socket)
    {
        const token = client.handshake.auth.token;
        if(!token)
            throw new BadRequestException("JWT TOken unaivaiable");
        const payload = await this.jwtService.verifyAsync(token,{secret:env.REALTIME_JWT_SECRET});
        return payload.recipientId;
    }
}