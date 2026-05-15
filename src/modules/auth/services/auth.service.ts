import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {OAuth2Client} from 'google-auth-library';
import { env } from 'src/config/env';
import { createUser, getUserByGoogleId } from 'src/db/queries/user.query';
import { ApiKeyRepositoryService } from '../../api-key/reporsitory/api-key.repository';



@Injectable()
export class AuthService {
    private googleClient = new OAuth2Client({client_id:env.GOOGLE_CLIENT_ID});
    constructor(private jwtService:JwtService){};

    async googleAuth(token:string)
    {
        const ticket = await this.googleClient.verifyIdToken({
            idToken:token,audience:env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if(!payload)
            throw new UnauthorizedException("Invalid Google Token");
        if(!payload.email)
            throw new UnauthorizedException("Email is not available");
        if(!payload.email_verified)
            throw new UnauthorizedException("Email is not Verified");

        const email = payload.email;
        const userName = payload.sub;
        const googleId = payload.sub;

        let user = await getUserByGoogleId(googleId);

        if(!user)
        {
            const user = await createUser(userName,googleId,email);
        }

        const accesToken = await this.jwtService.signAsync({sub:user.id,email:user.email},{secret:env.JWT_SECRET,expiresIn:"7d"});

        return {accesToken};

    }
}
