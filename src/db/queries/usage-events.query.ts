import { UsageEventType } from "src/types/db.types";
import { db } from "..";
import { usageEvents } from "../schema/usageEvents_table";
import { and, eq, gt, gte, sum } from "drizzle-orm";

export async function recordUsageEventByRecipientId(userId:string,type:UsageEventType)
{
    const [record] = await db.insert(usageEvents).values({userId,type}).returning();
    return record;
}

export async function getMonthlyUsage(userId:string,type:UsageEventType)
{
    const startOfMonth = new Date(
                                 new Date().getFullYear(),
                                 new Date().getMonth(),
                                 1
    );
    const [{usage}] = await db.select({usage:sum(usageEvents.count)}).from(usageEvents).where(and(eq(usageEvents.userId,userId),eq(usageEvents.type,type),gte(usageEvents.createdAt,startOfMonth)));
    return Number(usage?? 0);
}