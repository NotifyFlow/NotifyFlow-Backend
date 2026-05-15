import { pgTable, varchar, timestamp, uuid, pgEnum,text,index,uniqueIndex} from "drizzle-orm/pg-core";
import { users } from "./schema";

export const emailProviderModeEnum = pgEnum("email_provider_mode",["MANAGED","BYO"]);
export const emailProviderEnum = pgEnum("email_provider",["RESEND"])

export const userEmailProviders =
pgTable(
  "user_email_providers",
  {
      id: uuid("id").primaryKey().defaultRandom(),

      userId: uuid("user_id").notNull().references(() => users.id,{onDelete:"cascade"}),

      mode: emailProviderModeEnum("mode").notNull(),

      provider: emailProviderEnum("provider"),

      encryptedApiKey: text("encrypted_api_key"),

      fromEmail: varchar("from_email",{length:255}),

      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
  },
  (table)=>({

        userIdx: index("user_email_provider_user_idx").on(table.userId),

        providerIdx: index( "user_email_provider_provider_idx").on(table.provider),

        userProviderUnique:uniqueIndex("user_provider_unique_idx").on(table.userId,table.provider)
    })
);