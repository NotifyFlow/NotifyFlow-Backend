import { Controller, Get, Param, Post, UseGuards,Body } from "@nestjs/common";
import { ApiKeyService } from "../services/api-key.service";
import { AuthGaurd } from "src/modules/auth/guards/auth.guard";
import { CurrentUser } from "src/modules/auth/decorators/currentuser.decorator";
import { UserDto } from "src/modules/notifications/dto/user-schema.dto";


@Controller('api-keys')
export class ApiKeyController{
    constructor(private apiKeyService:ApiKeyService){};
    @Post()
    @UseGuards(AuthGaurd)
    async createApiKey(@CurrentUser() userData:UserDto, @Body() data:{name:string})
    {
        const rawApikey = await this.apiKeyService.createToken(userData,data.name);
        return {apiKey:rawApikey};
    } 

    @Get()
    @UseGuards(AuthGaurd)
    async getApiKeys(@CurrentUser() user:UserDto)
    {
        const apiKeys = await this.apiKeyService.getAllPrefixes(user.id);
        return {apiKeys:apiKeys};
    }

    @Post(':id/revoke')
    @UseGuards(AuthGaurd)
    async revoke(@CurrentUser() user:UserDto,@Param('id') id:string)
    {   
        await this.apiKeyService.revokeToken(id,user.id);
    } 
}
