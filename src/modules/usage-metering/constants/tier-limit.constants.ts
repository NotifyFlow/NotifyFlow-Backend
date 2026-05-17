import { UsageEventType } from "../enums/usage-events.enum";

export const TIER_LIMITS = {
    FREE:{
        [UsageEventType.NOTIFICATION_CREATED]:1000,
        [UsageEventType.EMAIL_SENT]:50,
        [UsageEventType.PUSH_SENT]:500,
        [UsageEventType.IN_APP_SENT]:1000
    },

    PRO:{
        [UsageEventType.NOTIFICATION_CREATED]:100000,
        [UsageEventType.EMAIL_SENT]:500,
        [UsageEventType.PUSH_SENT]:100000,
        [UsageEventType.IN_APP_SENT]:100000
    },

    ENTERPRISE:{
        [UsageEventType.NOTIFICATION_CREATED]:Number.MAX_SAFE_INTEGER,
        [UsageEventType.EMAIL_SENT]:Number.MAX_SAFE_INTEGER,
        [UsageEventType.PUSH_SENT]:Number.MAX_SAFE_INTEGER,
        [UsageEventType.IN_APP_SENT]:Number.MAX_SAFE_INTEGER
    }
};  