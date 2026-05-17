//Checks whether the Tenant or user can avail the service

import { Injectable } from "@nestjs/common";
import { UsageMetricRepositoryService } from "../repository/usage-metering.repository";
import { TierType, UsageEventType } from "src/types/db.types";
import { TIER_LIMITS } from "../constants/tier-limit.constants";
import { QuotaExceededException } from "src/utils/errorhandling";

@Injectable()
export class QuotaService
{
    constructor(private usageMetricRepository:UsageMetricRepositoryService){}
    async canSendNotifications(userId:string,type:UsageEventType,tier:TierType)
    {
        const quotaUsedThisMonth = await this.usageMetricRepository.calculateOneMonthUsage(userId,type);
        const maxUsage:number = TIER_LIMITS[tier][type].notificationsPerMonth;
        if(quotaUsedThisMonth >= maxUsage)
            throw new QuotaExceededException();
        return;
    }
}