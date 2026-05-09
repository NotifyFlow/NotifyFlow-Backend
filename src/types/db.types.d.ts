import { ExtractTablesWithRelations } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { db } from "src/db";
import * as schema from "src/db/schema.ts"


type Transaction = PgTransaction<PostgresJsQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export type Type = "MESSAGE_RECEIVED"|"SYSTEM_ANNOUNCEMENT"|"ACCOUNT_ALERT"|"MARKETPLACE_UPDATE";
export type DbExecutor = typeof db | Transaction;