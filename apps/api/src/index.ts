import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { ENV } from './constants/envvars'

const app = new Elysia()
    .use(cors({
        origin: ENV.FRONTEND_URL,
        credentials: true,
    }))
    .get('/health', () => ({ status: 'ok' }))
    .listen(ENV.PORT)

console.log(`rum-core api running on port 5000`)