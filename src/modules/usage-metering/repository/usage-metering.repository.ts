import { Injectable } from "@nestjs/common";
import { getMonthlyUsage, recordUsageEventByRecipientId } from "src/db/queries/usage-events.query";
import { UsageEventType } from "src/types/db.types";


@Injectable()
export class UsageMetricRepositoryService{
    async recordUsageEvent(userId:string,type:UsageEventType)
    {
        return await recordUsageEventByRecipientId(userId,type);
    }

    async calculateOneMonthUsage(userId:string,type:UsageEventType)
    {
        return await getMonthlyUsage(userId,type)
    }
}