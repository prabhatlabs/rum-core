import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

neonConfig.webSocketConstructor = WebSocket

let _sql: Pool | null = null
let _db: NeonDatabase<typeof schema> & {
    $client: Pool;
} | null = null;

export function initMainDB(url: string) {
    if (_db) {
        return;
    }
    _sql = new Pool({
        connectionString: url
    });
    _db = drizzle(_sql, { schema });
    console.log('Connected to maindb');
}

export function getMainDB() {
    if (!_db) {
        throw new Error('No maindb client')
    }
    return _db
}

export function getMainDBSQL() {
    if (!_sql) {
        throw new Error('No maindb client')
    }
    return _sql
}