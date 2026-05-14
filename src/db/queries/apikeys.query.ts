import { and, eq } from "drizzle-orm";
import { db } from "..";
import { apiKeys } from "../schema/apiKeys_table";

export async function getUserIdByApiKey(hashedApiKey:string)
{
    const [userId] = await db.select({userId:apiKeys.userId}).from(apiKeys).where(eq(apiKeys.keyHash,hashedApiKey));
    return userId;
}