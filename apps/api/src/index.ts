import { cors } from '@elysiajs/cors'
import html from '@elysiajs/html'
import { initEventDB, initMainDB } from '@rum-core/db'
import { APIErrorResponse, failResponse } from '@rum-core/shared'
import Elysia from 'elysia'
import { ENV } from './constants/envvars'
import authRoute from './routes/auth.routes'
import cronRoutes from './routes/cron.routes'
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
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        exposeHeaders: ['Set-Cookie'],
        preflight: true,
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
    .use(cronRoutes)
    .use(html())
    .get('/', ({ set }) => {
        const url = "https://ref.prabhatlabs.dev"
        set.headers
        return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="refresh" content="1;url=${url}" />
                    <script>window.location.href = "${url}";</script>
                </head>
                <body>
                    <p>${url ? "Redirecting..." : "Ahoy! Something went wrong"}</p>
                    <p>Click <a href="${url}">here</a>,if you are not redirected.</p>
                </body>
            </html>
        `
    })
    .get('/health', () => ({ status: 'ok' }))
    .listen(ENV.PORT, () => console.log(`[INFO] rum-core api running on port ${ENV.PORT}\n`))
