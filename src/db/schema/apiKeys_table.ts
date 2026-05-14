import { pgTable, varchar, timestamp, uuid, pgEnum,boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./schema";

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade"
      }),

    keyHash: varchar("key_hash", {
      length: 255
    }).notNull(),

    name: varchar("name", {
      length: 100
    }),

    lastUsedAt: timestamp("last_used_at"),

    revoked: boolean("revoked")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull()
  }
);