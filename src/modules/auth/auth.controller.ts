import { Controller, Post, UseGuards,Req ,Body} from '@nestjs/common';
import { ApiKeyGuard } from './guards/api-key.guard';
import { RealtimeTokenService } from './services/realtime-token.service';
import { type Request } from 'express';
import GetTokenDto from './dto/getToken.dto';

@Controller('auth')
export class AuthController {
    constructor(private realtimeTokenService:RealtimeTokenService){}
    
    @Post('real-time')
    @UseGuards(ApiKeyGuard)
    async getToken(@Req() req:Request, @Body() getTokenDto:GetTokenDto)
    {   
        //@ts-ignore
        const userId = req.userId;
        const token = await this.realtimeTokenService.generateToken(userId,getTokenDto.recipientId);
        return token;
    }

}
