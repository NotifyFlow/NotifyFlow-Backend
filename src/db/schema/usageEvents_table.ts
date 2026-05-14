import { pgTable, varchar, timestamp, uuid, pgEnum,boolean, uniqueIndex,index } from "drizzle-orm/pg-core";
import { users } from "./schema";

export const usageEvents = pgTable(
  "usage_events",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade"
      }),

    type: varchar("type", {
      length: 100
    }).notNull(),

    count: varchar("count", {
      length: 20
    }).default("1"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull()
  },
  (table)=>({
      tenantIdx:index(
        "usage_user_idx"
      ).on(table.userId),

      typeIdx:index(
        "usage_type_idx"
      ).on(table.type)
  })
);