import { cookie } from '@elysiajs/cookie'
import { generateCodeVerifier, generateState } from 'arctic'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { ENV } from '../constants/envvars'
import { db } from '../db'
import { users } from '../db/schema'
import { github, google } from '../lib/oauth'
import { failResponse, ok } from '../lib/response'
import { cookieConfig, jwtConfig } from '../middleware/auth.middleware'
import { upsertUser } from '../services/auth.service'

export const authRoutes = new Elysia({ prefix: '/auth' })
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

        cookie.google_state.set({ value: state, httpOnly: true, maxAge: 600 })
        cookie.google_verifier.set({ value: codeVerifier, httpOnly: true, maxAge: 600 })

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

        const user = await upsertUser({
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

        const token = await jwt.sign({ sub: user.id })
        cookie.auth?.set({
            value: token,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: 'lax',
        })

        return redirect(`${ENV.FRONTEND_URL}/dashboard`)
    })

    // GITHUB oauth
    .get('/github', async ({ cookie, redirect }) => {
        const state = generateState()
        const url = github.createAuthorizationURL(state, ['user:email'])

        if (!cookie.github_state) {
            return failResponse('Missing cookie')
        }

        cookie.github_state.set({ value: state, httpOnly: true, maxAge: 600 })

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

        const user = await upsertUser({
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
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: 'lax',
        })

        return redirect(`${ENV.FRONTEND_URL}/dashboard`)
    })

    .get('/me', async ({ cookie, jwt, set }) => {
        const token = cookie.auth?.value
        if (!token) {
            set.status = 401
            return failResponse('Unauthorized')
        }

        const payload = await jwt.verify(token)
        if (!payload) {
            set.status = 401
            return failResponse('Unauthorized')
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.sub as string)
        })

        if (!user) {
            set.status = 401
            return failResponse('Unauthorized')
        }

        return ok(user)
    })

    .post('/logout', ({ cookie }) => {
        cookie.auth.set({
            value: '',
            httpOnly: true,
            maxAge: 0,
        })
        return ok(null, 'Logged out successfully')
    })