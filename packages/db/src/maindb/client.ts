import {
    neon,
    neonConfig,
    Pool,
    type NeonQueryFunction,
} from "@neondatabase/serverless";
import {
    drizzle as drizzleHttp,
    type NeonHttpDatabase,
} from "drizzle-orm/neon-http";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

neonConfig.webSocketConstructor = WebSocket;

let _sql: Pool | null = null;
let _db:
    | (NeonDatabase<typeof schema> & {
          $client: Pool;
      })
    | null = null;

let _http_sql: NeonQueryFunction<false, false> | null = null;
let _http_db:
    | (NeonHttpDatabase<typeof schema> & {
          $client: NeonQueryFunction<false, false>;
      })
    | null = null;

export function initMainDB(url: string) {
    if (_db) {
        return;
    }
    _sql = new Pool({
        connectionString: url,
    });
    _db = drizzle(_sql, { schema });
    console.log("Connected to maindb");
}

export function initMainDBForWorker(url: string) {
    if (_http_db) {
        return;
    }
    _http_sql = neon(url);
    _http_db = drizzleHttp(_http_sql, { schema });
    console.log("Connected to maindb");
}

export function getMainDB() {
    if (!_db) {
        throw new Error("No maindb client");
    }
    return _db;
}

export function getMainDBHttp() {
    if (_http_db) return _http_db;
    throw new Error("No maindb client");
}

export function getMainDBSQL() {
    if (!_sql) {
        if (_http_sql) return _http_sql;
        throw new Error("No maindb client");
    }
    return _sql;
}
