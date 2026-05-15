import { Module } from "@nestjs/common";
import { ApiKeyService } from "./services/api-key.service";
import { ApiKeyGuard } from "../auth/guards/api-key.guard";

@Module({
    imports:[ApiKeyGuard],
    providers:[ApiKeyService],
    exports:[ApiKeyService]
})
export class ApiKeyModule{

}