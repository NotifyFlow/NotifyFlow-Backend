import { Injectable } from "@nestjs/common";
import { getMonthlyUsage,recordUsageEventByUserId } from "src/db/queries/usage-events.query";
import { UsageEventType } from "src/types/db.types";


@Injectable()
export class UsageMetricRepositoryService{
    async recordUsageEvent(userId:string,type:UsageEventType)
    {
        return await recordUsageEventByUserId(userId,type);
    }

    async calculateOneMonthUsage(userId:string,type:UsageEventType)
    {
        return await getMonthlyUsage(userId,type)
    }

}