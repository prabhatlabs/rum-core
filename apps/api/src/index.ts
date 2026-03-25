import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'
import { cacheService, initEventDB, initMainDB } from '@rum-core/db'
import { APIErrorResponse, failResponse } from '@rum-core/shared'
import { file } from 'bun'
import Elysia from 'elysia'
import { ENV } from './constants/envvars'
import authRoute from './routes/auth.routes'
import cronRoutes from './routes/cron.routes'
import projectsRoutes from './routes/projects.routes'
import usageRoutes from './routes/usage.routes'

// db init
initMainDB(process.env.DATABASE_URL!);
initEventDB(process.env.TURSO_DATABASE_URL!, process.env.TURSO_AUTH_TOKEN!);
cacheService.initRedis(ENV.UPSTASH_REDIS_REST_URL, ENV.UPSTASH_REDIS_REST_TOKEN);

const app = new Elysia({
    prefix: "/api/v1",
})
    .use(cors({
        origin: ENV.FRONTEND_URL,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        exposeHeaders: ['Set-Cookie'],
        preflight: true,
    }))
    .use(staticPlugin({
        assets: 'public'
    }))
    .onError(({ error, set, request }) => {
        if (error instanceof APIErrorResponse) {
            set.status = error.code
            return failResponse(`[${error.name}]: ${error.error}`, error.message)
        }

        // unhandled error
        console.log(`[INFO] ${request.method} ${request.url.split('/api/v1')[1] || request.url}`)
        console.error("[ERROR]", error)
        set.status = 500
        return failResponse("InternalServerError", 'Something went wrong')
    })
    .use(authRoute)
    .use(projectsRoutes)
    .use(usageRoutes)
    .use(cronRoutes)
    .get('/favicon.ico', () => file('public/favicon.ico'))
    .get('/health', () => ({ status: 'ok' }))
    .listen(ENV.PORT, () => console.log(`[INFO] rum-core api running on port ${ENV.PORT}\n`))
