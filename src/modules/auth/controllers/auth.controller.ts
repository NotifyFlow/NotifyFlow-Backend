import { Controller, Post, UseGuards,Req,Param ,Get,Body} from '@nestjs/common';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { RealtimeTokenService } from '../services/realtime-token.service';
import { type Request } from 'express';
import GetTokenDto from '../dto/getToken.dto';
import { AuthService } from '../services/auth.service';
import { AuthGaurd } from '../guards/auth.guard';
import { UsersService } from 'src/modules/users/users.service';
import { CurrentUser } from '../decorators/currentuser.decorator';


@Controller('auth')
export class AuthController {
    constructor(private realtimeTokenService:RealtimeTokenService,
                private authService:AuthService,
                private userService:UsersService){}
  
    //This endpoint is to Validate Request From Tenant's Backend of the application
    @Post('real-time')
    @UseGuards(ApiKeyGuard)
    async getRealtimeToken(@Req() req:Request, @Body() getTokenDto:GetTokenDto)
    {   
        //@ts-ignore
        const userId = req.userId;
        const token = await this.realtimeTokenService.generateToken(userId,getTokenDto.recipientId);
        return token;
    }

    //This Endpoint is to authenticate Tenant's access to Dashboard
    @Post('google')
    async google(@Body() data:{token:string})
    {
        return await this.authService.googleAuth(data.token);
    }

    @Get('me')
    @UseGuards(AuthGaurd)
    async me(@CurrentUser() userData:{userId:string,email:string})
    {
        const userId = userData.userId;
        const user = await this.userService.getUserById(userId);
        return user;
    }
   
}
