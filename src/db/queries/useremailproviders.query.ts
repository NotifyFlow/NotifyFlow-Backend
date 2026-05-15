import { eq } from "drizzle-orm";
import { db } from "..";
import { userEmailProviders } from "../schema/userEmailProviders_table";


export async function getEmailConfigByUserId(userId:string)
{
    const [provider] = await db.select().from(userEmailProviders).where(eq(userEmailProviders.userId,userId));
    return provider;
}