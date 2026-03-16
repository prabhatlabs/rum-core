import { cors } from '@elysiajs/cors'
import { initEventDB, initMainDB } from '@rum-core/db'
import { APIErrorResponse, failResponse } from '@rum-core/shared'
import Elysia from 'elysia'
import { ENV } from './constants/envvars'
import authRoute from './routes/auth.routes'
import projectsRoutes from './routes/projects.routes'

// db init
initMainDB(process.env.DATABASE_URL!);
initEventDB(process.env.TURSO_DATABASE_URL!, process.env.TURSO_AUTH_TOKEN!);

const app = new Elysia({
    prefix: "/api/v1",
})
    .use(cors({
        origin: ENV.FRONTEND_URL,
        credentials: true,
    }))
    .onRequest(({ request }) => {
        console.log(`[INFO] ${request.method} ${request.url.split('/api/v1')[1] || request.url}`)
    })
    .onError(({ error, set }) => {
        if (error instanceof APIErrorResponse) {
            set.status = error.code
            return failResponse(`[${error.name}]: ${error.error}`, error.message)
        }

        // unhandled error
        console.error("[ERROR]", error)
        set.status = 500
        return failResponse("InternalServerError", 'Something went wrong')
    })
    .use(authRoute)
    .use(projectsRoutes)
    .get('/health', () => ({ status: 'ok' }))
    .listen(ENV.PORT, () => console.log(`[INFO] rum-core api running on port ${ENV.PORT}\n`))
