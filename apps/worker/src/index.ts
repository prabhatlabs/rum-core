import { initEventDB, initMainDB } from "@rum-core/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ingestPageVitals, ingestRequestEvents } from "./controllers/events";
import { validateRequest } from "./middlewares/vaidation";

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        TURSO_DATABASE_URL: string;
        TURSO_AUTH_TOKEN: string;
    };
}>();

app.use(
    "/*",
    cors({
        origin: (origin) => origin, // echo back whatever origin is requesting
        credentials: true,
    }),
);

app.use("*", (c, next) => {
    initMainDB(c.env.DATABASE_URL);
    initEventDB(c.env.TURSO_DATABASE_URL, c.env.TURSO_AUTH_TOKEN);
    return next();
});

app.get("/health", (c) => {
    return c.text("Working!");
});

app.use(validateRequest);
app.post("/ingest/events", ingestRequestEvents);
app.post("/ingest/vitals", ingestPageVitals);

export default app;
