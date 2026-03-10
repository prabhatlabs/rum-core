import { neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { ENV } from '../constants/envvars'
import * as schema from './schema'

neonConfig.webSocketConstructor = WebSocket

const pool = new Pool({ connectionString: ENV.DATABASE_URL })
export const db = drizzle(pool, { schema })