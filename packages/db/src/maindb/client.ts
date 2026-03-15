import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

neonConfig.webSocketConstructor = WebSocket

// will pick the env from the workspace, which called
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
export const db = drizzle(pool, { schema });