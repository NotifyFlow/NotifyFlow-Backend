import { pgTable, varchar, timestamp, uuid, index,boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./schema";
export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),

    hashedKey: varchar("key_hash", {length: 255}).notNull(),

    prefix: varchar("prefix",{length:32}).notNull(),

    name: varchar("name", {length: 100}),

    lastUsedAt: timestamp("last_used_at"),

    revoked: boolean("revoked").default(false).notNull(),
    revokedAt: timestamp(),

    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table)=>({
    userIdx: index("api_key_user_idx").on(table.userId),
    prefixIdx: uniqueIndex("api_key_prefix_idx").on(table.userId)
  })
);