import { and, eq } from "drizzle-orm";
import { db } from "..";
import { apiKeys } from "../schema/apiKeys_table";

export async function getUserIdByPrefix(prefix:string)
{
    const [record] = await db.select({userId:apiKeys.userId,hashedKey:apiKeys.hashedKey}).from(apiKeys).where(and(eq(apiKeys.prefix,prefix),eq(apiKeys.revoked,false)));
    return record;
}

export async function storeApiKey(userId:string,hashedKey:string,prefix:string,name:string)
{
    await db.insert(apiKeys).values({userId,hashedKey,prefix,name}).returning();
    return ;
}

export async function revokeApiToken(id:string,userId:string) {
    const [result] = await db.update(apiKeys).set({revoked:true,revokedAt:new Date()}).where(and(eq(apiKeys.id,id),eq(apiKeys.userId,userId))).returning();
    return result;
}

export async function getAllPrefixes(userId:string)
{
    const apiKey = await db.select({id:apiKeys.id,prefix:apiKeys.prefix,name:apiKeys.name,lastUsedAt:apiKeys.lastUsedAt,revoked:apiKeys.revoked}).from(apiKeys).where(eq(apiKeys.userId,userId));
    return apiKey;
}