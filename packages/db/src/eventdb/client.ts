import { createClient, type Client } from "@libsql/client/http";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

let _sql: Client | null = null;

let _db: LibSQLDatabase<typeof schema> & {
    $client: Client;
} | null = null;

export function initEventDB(url: string, authToken: string) {
    if (_db) {
        return;
    }

    _sql = createClient({
        url,
        authToken
    });
    _db = drizzle(_sql, { schema });
}

export function getEventDB() {
    if (!_db) {
        throw new Error("EventDB not initialized");
    }
    return _db;
}

export function getEventDBClient() {
    if (!_sql) {
        throw new Error("EventDB not initialized");
    }
    return _sql;
}