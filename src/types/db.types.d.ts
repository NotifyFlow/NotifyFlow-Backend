import { ExtractTablesWithRelations } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { db } from "src/db";
import * as schema from "src/db/schema/schema"


type Transaction = PgTransaction<PostgresJsQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export type Type = "MESSAGE_RECEIVED"|"SYSTEM_ANNOUNCEMENT"|"ACCOUNT_ALERT"|"MARKETPLACE_UPDATE";
export type DbExecutor = typeof db | Transaction;
export type subscriptionTierType = "FREE"|"PRO"|"ENTERPRISE";


export type NotificationType = typeof schema.notifications.$inferSelect;

export type PlatformType = "WEB" | "ANDROID" | "IOS";
export type CurrentUserType = {userId:string,email:string};

export type WierdType = {}