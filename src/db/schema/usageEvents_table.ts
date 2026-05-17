import { pgTable,integer, varchar, timestamp, uuid, pgEnum,boolean, uniqueIndex,index } from "drizzle-orm/pg-core";
import { users } from "./schema";

export const usageEventTypeEnum = pgEnum(
   "usage_event_type",
   [
      "NOTIFICATION_CREATED",
      "EMAIL_SENT",
      "PUSH_SENT",
      "IN_APP_SENT",
      "API_REQUEST"
   ]
);




export const usageEvents = pgTable(
  "usage_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),

    type: usageEventTypeEnum("type").notNull(),

    count: integer("count").default(1).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table)=>({
      userIdx:index("usage_user_idx")
        .on(table.userId),

      typeIdx:index("usage_type_idx")
        .on(table.type),

      userTypeIdx:index("usage_user_type_idx")
        .on(table.userId, table.type)
  })
);