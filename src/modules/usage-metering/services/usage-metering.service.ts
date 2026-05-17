//Records Tenant Users Usage

import { Injectable } from "@nestjs/common";
import { UsageEventType } from "src/types/db.types";
import { UsageMetricRepositoryService } from "../repository/usage-metering.repository";


@Injectable()
export class UsageMeteringService{
    constructor(private usageMetricRepositorty:UsageMetricRepositoryService){};

    async recordUsage(userId:string,type:UsageEventType)
    {
        await this.usageMetricRepositorty.recordUsageEvent(userId,type);
    }
}