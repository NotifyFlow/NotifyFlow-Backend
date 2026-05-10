
import { pgTable, varchar, timestamp, uuid, pgEnum,text,boolean, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";

export const notificationTypeEnum = pgEnum("notification_type",[ "MESSAGE_RECEIVED","SYSTEM_ANNOUNCEMENT","ACCOUNT_ALERT","MARKETPLACE_UPDATE",]);
export const statusEnum = pgEnum("status",["PENDING","PROCESSING","SENT","FAILED"]);
export const channelEnum = pgEnum("channel",["IN_APP","EMAIL","PUSH"]);
export const platformEnum = pgEnum("platform", ["WEB","ANDROID","IOS",]);
export const subscriptionTierEnum = pgEnum("subscription_tier", ["FREE","PRO","ENTERPRISE"]);

export const users = pgTable("users",{
    id: uuid("id").primaryKey().defaultRandom(),
    userName: varchar("username",{length:50}).notNull(),
    googleId: varchar("google_id", { length: 256 }).unique(),
    email: varchar("email",{length:256}).unique().notNull(),
    subscriptionTier: subscriptionTierEnum("subscription_tier").default("FREE").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
                .notNull()
                .defaultNow()
                .$onUpdate(() => new Date())
});

export const recipients = pgTable(
  "recipients",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    externalId: varchar("external_id", { length: 255 }).notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    tenantExternalUnique: uniqueIndex(
      "recipient_tenant_external_unique"
    ).on(table.tenantId, table.externalId),

    tenantIdx: index("recipient_tenant_idx").on(table.tenantId),
  })
);


export const notifications = pgTable('notifications',{
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(()=>users.id, {onDelete:"cascade"}),
    recipientId: uuid("recepient_id").notNull().references(()=>recipients.id,{onDelete:"cascade"}),
    title: varchar("title",{ length: 150 }).notNull(),
    body:  text("body").notNull(),
    type:   notificationTypeEnum("type").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    idempotencyKey: varchar("idempotency_key", {length:255}),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
                .notNull()
                .defaultNow()
                .$onUpdate(() => new Date())
}, (table) => ({
        recipientIdx: index("notifications_recipient_idx").on(
        table.recipientId
        ),

        createdAtIdx: index("notifications_created_at_idx").on(
        table.createdAt
        ),

        idempotencyIdx: index(
        "notifications_idempotency_idx"
        ).on(table.idempotencyKey),

        tenantIdempotencyTechnique: uniqueIndex("notification_user_idempotency_unique").on(table.userId,table.idempotencyKey),
    }));

export const notificationDeliveries = pgTable("notification_deliveries",{
    id: uuid("id").primaryKey().defaultRandom(),
    notificationId: uuid("notification_id").notNull().references(()=>notifications.id , {onDelete:"cascade"}),
    channel: channelEnum("channel").notNull(),
    status: statusEnum("status").default("PENDING").notNull(),
    provider: varchar("provider", { length: 50 }),
    errorMessage:text("error_message"),
    sentAt: timestamp("sent_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
                .notNull()
                .defaultNow()
                .$onUpdate(() => new Date())
}, (table) => ({
    notificationIdx: index(
      "delivery_notification_idx"
    ).on(table.notificationId),

    statusIdx: index("delivery_status_idx").on(
      table.status
    ),

    channelIdx: index("delivery_channel_idx").on(
      table.channel
    ),
  }));

export const userDevices = pgTable('user_devices',{
    id: uuid("id").primaryKey().defaultRandom(),
    recipientId: uuid("recepient_id").notNull().references(()=>recipients.id,{onDelete:"cascade"}),
    fcmToken: varchar("fcm_token",{ length: 512 }).unique().notNull(),
    platform: platformEnum("platform").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
                .notNull()
                .defaultNow()
                .$onUpdate(() => new Date())
}, (table) => ({
    recipientIdx: index("device_recipient_idx").on(
      table.recipientId
    ),

    tokenIdx: index("device_token_idx").on(
      table.fcmToken
    ),
  }));