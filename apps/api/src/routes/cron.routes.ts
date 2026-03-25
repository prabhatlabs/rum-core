import { cronService } from "@rum-core/db";
import Elysia from "elysia";
import { cronMiddleware } from "../middleware/cron.middleware";

const cronRoutes = new Elysia({
    prefix: "/cron",
})
    .use(cronMiddleware)
    .post("/hourly", async () => {
        await cronService.runHourlyCron();
    })
    .post("/daily", async () => {
        await cronService.runDailyCron();
    })
    .post("/monthly", async () => {
        await cronService.runMonthlySummary();
    });

export default cronRoutes;
