import { and, eq } from "drizzle-orm";
import { type DbExecutor } from "src/types/db.types";
import { recipients } from "../schema/schema";
import { db } from "..";



export async function createReceipient(externalId:string,userId:string,executor?:DbExecutor)
{
    return await (executor ? executor : db).insert(recipients).values({tenantId:userId,externalId:externalId}).returning();
}

export async function getRecipientByExternalIdAndUserID(externalId:string,userId:string,executor?:DbExecutor)
{
    const conditions = [eq(recipients.externalId, externalId),eq(recipients.tenantId, userId)]
    const [rec] = await (executor ? executor : db).select().from(recipients).where(and(...conditions));
    return rec;
}