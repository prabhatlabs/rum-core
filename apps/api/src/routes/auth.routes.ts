import { cookie } from "@elysiajs/cookie";
import { authService } from "@rum-core/db";
import {
    APIErrorResponse,
    failResponse,
    okResponse,
    validateResetPasswordForm,
    validateSignupForm,
} from "@rum-core/shared";
import { generateCodeVerifier, generateState } from "arctic";
import { Elysia, t } from "elysia";
import {
    AUTH_COOKIE_CLEAR_CONFIG,
    AUTH_COOKIE_CONFIG,
} from "../constants/cookie";
import { ENV } from "../constants/envvars";
import { comparePassword, hashPassword } from "../lib/hashing";
import mail from "../lib/mail";
import { github, google } from "../lib/oauth";
import {
    authMiddleware,
    cookieConfig,
    jwtConfig,
} from "../middleware/auth.middleware";

const authRoutes = new Elysia({ prefix: "/auth" })
    .use(jwtConfig)
    .guard(cookieConfig)
    .use(cookie())

    // email/password login
    .post(
        "/emailpassword",
        async ({ body, jwt, cookie }) => {
            const { email, password } = body;
            const user = await authService.getUserByEmail(email);
            if (!user) {
                return failResponse("User not found");
            }

            if (!user.password) {
                return failResponse(
                    "Password not set for this user, use different login method",
                );
            }

            const isValid = comparePassword(password, user.password);
            if (!isValid) {
                return failResponse("Invalid email or password");
            }

            if (!user.verified) {
                const sessionId = await authService.setUserSession(user.id);
                const url = `${ENV.FRONTEND_URL}/auth/callback?ref=${sessionId}`;
                await mail.sendEmailVerificationMail(user.email, url);
                throw new APIErrorResponse(
                    "UnauthorizedUserError",
                    "Unauthorized",
                    "User not verified, verification link has been sent to your email",
                    401,
                );
            }

            const token = await jwt.sign({ sub: user.id });
            cookie.auth.set({
                value: token,
                ...AUTH_COOKIE_CONFIG,
            });

            return okResponse(null, `Logged in, Welcome back ${user.name}`);
        },
        {
            body: t.Object({
                email: t.String(),
                password: t.String(),
            }),
        },
    )
    .post(
        "/signup",
        async ({ body }) => {
            const { name, email, password, confirmPassword } = body;
            const isCorrect = validateSignupForm({
                name,
                email,
                password,
                confirmPassword,
            });
            if (!isCorrect.isValid) {
                return failResponse(Object.values(isCorrect.errors).join(", "));
            }

            const user = await authService.upsertUser({
                name,
                email,
                password: hashPassword(password),
                verified: false,
                avatar_url: "",
                provider: "emailpassword",
                provider_id: email,
            });

            if (!user) {
                return failResponse("Failed to create user");
            }

            const sessionId = await authService.setUserSession(user.id);
            const url = `${ENV.FRONTEND_URL}/auth/callback?ref=${sessionId}`;
            await mail.sendEmailVerificationMail(user.email, url);

            return okResponse(null, "User created, Verification email sent!");
        },
        {
            body: t.Object({
                name: t.String(),
                email: t.String(),
                password: t.String(),
                confirmPassword: t.String(),
            }),
        },
    )
    .post(
        "/forgot-password",
        async ({ body }) => {
            const { email } = body;
            const user = await authService.getUserByEmail(email);
            if (!user) {
                return failResponse("User not found");
            }

            const sessionId = await authService.setUserSession(user.id);
            const url = `${ENV.FRONTEND_URL}/auth/reset-password?ref=${sessionId}`;
            await mail.sendPasswordResetMail(user.email, url);

            return okResponse(null, "Password reset email sent!");
        },
        {
            body: t.Object({
                email: t.String(),
            }),
        },
    )
    .post(
        "/reset-password",
        async ({ body, query }) => {
            const { password, confirmPassword } = body;

            const isCorrect = validateResetPasswordForm({
                password,
                confirmPassword,
            });
            if (!isCorrect.isValid) {
                return failResponse(Object.values(isCorrect.errors).join(", "));
            }

            const sessionId = query.ref;
            const userId =
                await authService.exchangeSessionForUserId(sessionId);
            if (!userId) {
                return failResponse("Invalid session");
            }

            const user = await authService.getUserById(userId);
            if (!user) {
                return failResponse("User not found");
            }

            const hashedPassword = hashPassword(password);
            await authService.updatePassword(userId, hashedPassword);
            await authService.removeSession(sessionId);

            return okResponse(null, "Password reset successful!");
        },
        {
            body: t.Object({
                password: t.String(),
                confirmPassword: t.String(),
            }),
            query: t.Object({
                ref: t.String(),
            }),
        },
    )

    // GOOGLE oauth
    .get("/google", async ({ cookie, redirect }) => {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const url = google.createAuthorizationURL(state, codeVerifier, [
            "email",
            "profile",
        ]);

        if (!cookie.google_state || !cookie.google_verifier) {
            return failResponse("Missing cookie");
        }

        cookie.google_state.set({ value: state, ...AUTH_COOKIE_CONFIG });
        cookie.google_verifier.set({
            value: codeVerifier,
            ...AUTH_COOKIE_CONFIG,
        });

        return redirect(url.toString());
    })

    .get("/google/callback", async ({ query, cookie, redirect, set }) => {
        const { code, state } = query;

        if (state !== cookie.google_state?.value) {
            set.status = 400;
            return failResponse("Invalid state");
        }

        if (!code) {
            set.status = 400;
            return failResponse("Missing code");
        }

        if (!cookie.google_verifier.value) {
            set.status = 400;
            return failResponse("Missing verifier");
        }

        // Exchange code for tokens
        const tokens = await google.validateAuthorizationCode(
            code,
            cookie.google_verifier.value,
        );

        // Get user info from Google
        const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: { Authorization: `Bearer ${tokens.accessToken()}` },
            },
        );
        const googleUser = (await res.json()) as {
            sub: string;
            email: string;
            name: string;
            picture: string;
        };

        const user = await authService.upsertUser({
            email: googleUser.email,
            name: googleUser.name,
            verified: false,
            avatar_url: googleUser.picture,
            provider: "google",
            provider_id: googleUser.sub,
        });

        if (!user) {
            set.status = 500;
            return failResponse("Failed to create user");
        }

        const sessionId = await authService.setUserSession(user.id);
        return redirect(`${ENV.FRONTEND_URL}/auth/callback?ref=${sessionId}`);
    })

    // GITHUB oauth
    .get("/github", async ({ cookie, redirect }) => {
        const state = generateState();
        const url = github.createAuthorizationURL(state, ["user:email"]);

        if (!cookie.github_state) {
            return failResponse("Missing cookie");
        }

        cookie.github_state.set({ value: state, ...AUTH_COOKIE_CONFIG });

        return redirect(url.toString());
    })

    .get("/github/callback", async ({ query, cookie, redirect, set }) => {
        const { code, state } = query;

        if (!code) {
            set.status = 400;
            return failResponse("Missing code");
        }

        if (!cookie.github_state) {
            set.status = 400;
            return failResponse("Missing state");
        }

        if (state !== cookie.github_state.value) {
            set.status = 400;
            return failResponse("Invalid state");
        }

        // Exchange code for tokens
        const tokens = await github.validateAuthorizationCode(code);

        // Get user info from GitHub
        const res = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${tokens.accessToken()}` },
        });
        const githubUser = (await res.json()) as {
            id: number;
            email: string;
            name: string;
            avatar_url: string;
        };

        // GitHub may not return email — fetch separately
        let email = githubUser.email;
        if (!email) {
            const emailRes = await fetch("https://api.github.com/user/emails", {
                headers: { Authorization: `Bearer ${tokens.accessToken()}` },
            });
            const emails = (await emailRes.json()) as {
                email: string;
                primary: boolean;
            }[];
            email = emails.find((e) => e.primary)?.email ?? "";
        }

        const user = await authService.upsertUser({
            email,
            name: githubUser.name,
            verified: false,
            avatar_url: githubUser.avatar_url,
            provider: "github",
            provider_id: githubUser.id.toString(),
        });

        if (!user) {
            set.status = 500;
            return failResponse("Failed to create user");
        }

        const sessionId = await authService.setUserSession(user.id);
        return redirect(`${ENV.FRONTEND_URL}/auth/callback?ref=${sessionId}`);
    })

    // code-to-cookie-exchange
    .get(
        "/session",
        async ({ cookie, set, jwt, query }) => {
            const sessionId = query.ref;
            if (!sessionId) {
                set.status = 400;
                return failResponse("Missing ref");
            }

            const userId =
                await authService.exchangeSessionForUserId(sessionId);
            if (!userId) {
                set.status = 400;
                return failResponse("Invalid ref");
            }

            const token = await jwt.sign({ sub: userId });
            cookie.auth.set({
                value: token,
                ...AUTH_COOKIE_CONFIG,
            });

            await authService.markUserVerified(userId);
            return okResponse(null, "Session created");
        },
        {
            query: t.Object({
                ref: t.String(),
            }),
        },
    )

    .use(authMiddleware)
    .get("/me", async ({ user }) => {
        if (!user) {
            throw new APIErrorResponse(
                "UnauthorizedUserError",
                "Unauthorized",
                "Invalid token",
                401,
            );
        }

        return okResponse(user);
    })
    .post("/logout", ({ cookie }) => {
        cookie.auth.set({
            ...AUTH_COOKIE_CLEAR_CONFIG,
        });
        return okResponse(null, "Logged out successfully");
    });

export default authRoutes;
