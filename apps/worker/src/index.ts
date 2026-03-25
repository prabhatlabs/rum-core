import { initEventDB, initMainDBForWorker } from "@rum-core/db";
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
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type"],
    }),
);

app.use("*", (c, next) => {
    initMainDBForWorker(c.env.DATABASE_URL);
    initEventDB(c.env.TURSO_DATABASE_URL, c.env.TURSO_AUTH_TOKEN);
    return next();
});

app.get("/", (c) => {
    return c.text("Working!");
});

app.use(validateRequest);
app.post("/ingest/events", ingestRequestEvents);
app.post("/ingest/vitals", ingestPageVitals);

export default app;
