import { createReceipient, getRecipientByExternalIdAndUserID } from "src/db/queries/recepients.query";
import { type DbExecutor } from "src/types/db.types";
import { NotificationDto } from "../dto/create-notification.dto";
import { Injectable } from "@nestjs/common";


@Injectable()
export class RecipientRepositoryService{
    async getRecipientId(userId:string,recipientId:string,executor?:DbExecutor)
    {
        const rec = await getRecipientByExternalIdAndUserID(recipientId,userId,executor);
        const recId = (!rec) ? (await createReceipient(recipientId,userId,executor))[0].id : rec.id;
        return recId;
    }
}