import { cookie } from '@elysiajs/cookie'
import { authService } from '@rum-core/db'
import { APIErrorResponse, failResponse, okResponse } from '@rum-core/shared'
import { generateCodeVerifier, generateState } from 'arctic'
import { Elysia } from 'elysia'
import { AUTH_COOKIE_CLEAR_CONFIG, AUTH_COOKIE_CONFIG } from '../constants/cookie'
import { ENV } from '../constants/envvars'
import { github, google } from '../lib/oauth'
import { authMiddleware, cookieConfig, jwtConfig } from '../middleware/auth.middleware'

const authRoutes = new Elysia({ prefix: '/auth' })
    .use(jwtConfig)
    .guard(cookieConfig)
    .use(cookie())

    // GOOGLE oauth
    .get('/google', async ({ cookie, redirect }) => {
        const state = generateState()
        const codeVerifier = generateCodeVerifier()
        const url = google.createAuthorizationURL(state, codeVerifier, ['email', 'profile'])

        if (!cookie.google_state || !cookie.google_verifier) {
            return failResponse('Missing cookie')
        }

        cookie.google_state.set({ value: state, ...AUTH_COOKIE_CONFIG })
        cookie.google_verifier.set({ value: codeVerifier, ...AUTH_COOKIE_CONFIG })

        return redirect(url.toString())
    })

    .get('/google/callback', async ({ query, cookie, jwt, redirect, set }) => {
        const { code, state } = query

        if (state !== cookie.google_state?.value) {
            set.status = 400
            return failResponse('Invalid state')
        }

        if (!code) {
            set.status = 400
            return failResponse('Missing code')
        }

        if (!cookie.google_verifier.value) {
            set.status = 400
            return failResponse('Missing verifier')
        }

        // Exchange code for tokens
        const tokens = await google.validateAuthorizationCode(code, cookie.google_verifier.value)

        // Get user info from Google
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.accessToken()}` }
        })
        const googleUser = await res.json() as {
            sub: string
            email: string
            name: string
            picture: string
        }

        const user = await authService.upsertUser({
            email: googleUser.email,
            name: googleUser.name,
            avatar_url: googleUser.picture,
            provider: 'google',
            provider_id: googleUser.sub,
        });

        if (!user) {
            set.status = 500
            return failResponse('Failed to create user')
        }

        const token = await jwt.sign({ sub: user.id, status: false })
        cookie.pending_auth?.set({
            value: token,
            ...AUTH_COOKIE_CONFIG
        })
        return redirect(`${ENV.FRONTEND_URL}/auth/callback`)
    })

    // GITHUB oauth
    .get('/github', async ({ cookie, redirect }) => {
        const state = generateState()
        const url = github.createAuthorizationURL(state, ['user:email'])

        if (!cookie.github_state) {
            return failResponse('Missing cookie')
        }

        cookie.github_state.set({ value: state, ...AUTH_COOKIE_CONFIG })

        return redirect(url.toString())
    })

    .get('/github/callback', async ({ query, cookie, jwt, redirect, set }) => {
        const { code, state } = query;

        if (!code) {
            set.status = 400
            return failResponse('Missing code')
        }

        if (!cookie.github_state) {
            set.status = 400
            return failResponse('Missing state')
        }

        if (state !== cookie.github_state.value) {
            set.status = 400
            return failResponse('Invalid state')
        }

        // Exchange code for tokens
        const tokens = await github.validateAuthorizationCode(code)

        // Get user info from GitHub
        const res = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${tokens.accessToken()}` }
        })
        const githubUser = await res.json() as {
            id: number
            email: string
            name: string
            avatar_url: string
        }

        // GitHub may not return email — fetch separately
        let email = githubUser.email
        if (!email) {
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${tokens.accessToken()}` }
            })
            const emails = await emailRes.json() as { email: string, primary: boolean }[]
            email = emails.find(e => e.primary)?.email ?? ''
        }

        const user = await authService.upsertUser({
            email,
            name: githubUser.name,
            avatar_url: githubUser.avatar_url,
            provider: 'github',
            provider_id: githubUser.id.toString(),
        });

        if (!user) {
            set.status = 500
            return failResponse('Failed to create user')
        }

        const token = await jwt.sign({ sub: user.id })
        cookie.auth?.set({
            value: token,
            ...AUTH_COOKIE_CONFIG
        })

        return redirect(`${ENV.FRONTEND_URL}/auth/callback`)
    })
    .get('/session', async ({ cookie, set, jwt }) => {
        const token = cookie.pending_auth?.value
        if (!token) {
            set.status = 400
            return failResponse('Missing token')
        }

        cookie.pending_auth.set({
            ...AUTH_COOKIE_CLEAR_CONFIG
        })

        // status -> true = session created; false = session pending
        const payload = await jwt.verify(token)
        if (!payload || payload.status) {
            set.status = 400
            return failResponse('Invalid token')
        }

        const newToken = await jwt.sign({ sub: payload.sub, status: true });

        cookie.auth.set({
            value: newToken,
            ...AUTH_COOKIE_CONFIG
        })

        return okResponse(null, 'Session created')
    })
    .use(authMiddleware)
    .get('/me', async ({ user }) => {
        if (!user) {
            throw new APIErrorResponse("UnauthorizedUserError", 'Unauthorized', 'Invalid token', 401)
        }

        return okResponse(user)
    })

    .post('/logout', ({ cookie }) => {
        cookie.auth.set({
            ...AUTH_COOKIE_CLEAR_CONFIG
        })
        return okResponse(null, 'Logged out successfully')
    })

export default authRoutes;