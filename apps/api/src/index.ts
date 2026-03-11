import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { ENV } from './constants/envvars'
import APIErrorResponse from './lib/error'
import { failResponse } from './lib/response'
import authRoute from './routes/auth.routes'
import projectsRoutes from './routes/projects.routes'

const app = new Elysia({
    prefix: "/api/v1",
})
    .use(cors({
        origin: ENV.FRONTEND_URL,
        credentials: true,
    }))
    .onRequest(({ request }) => {
        console.log(`[INFO] ${request.method} ${request.url}`)
    })
    .error({
        CUSTOM: APIErrorResponse
    })
    .onError(({ error, code, set }) => {
        if (code !== "CUSTOM") {
            // unhandled error
            console.error("[ERROR]", error)
            set.status = 500
            return failResponse("InternalServerError", 'Something went wrong')
        }

        set.status = error.code
        return failResponse(`[${error.name}]: ${error.error}`, error.message)
    })
    .use(authRoute)
    .use(projectsRoutes)
    .get('/health', () => ({ status: 'ok' }))
    .listen(ENV.PORT, () => console.log(`[INFO] rum-core api running on port ${ENV.PORT}`))
