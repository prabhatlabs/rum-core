import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { ENV } from './constants/envvars'
import { failResponse } from './lib/response'
import { authRoutes } from './routes/auth.route'

const app = new Elysia()
    .use(cors({
        origin: ENV.FRONTEND_URL,
        credentials: true,
    }))
    .onError(({ error, set }) => {
        console.error("[ERROR]", error)
        set.status = 500
        return failResponse("Internal Server Error", 'Something went wrong')
    })
    .use(authRoutes)
    .get('/health', () => ({ status: 'ok' }))
    .listen(ENV.PORT)

console.log(`[INFO] rum-core api running on port 5000`)