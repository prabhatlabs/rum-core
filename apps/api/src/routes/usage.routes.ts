import { usageService } from "@rum-core/db";
import { okResponse } from "@rum-core/shared";
import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth.middleware";

const usageRoutes = new Elysia({ prefix: "/usage" }).use(authMiddleware).get(
    "/",
    async ({ user, query }) => {
        const timeRange = query.range ?? "7d";
        const data = await usageService.getUserUsageByDate(user.id, timeRange);
        return okResponse(data);
    },
    {
        query: t.Object({
            range: t.Optional(
                t.Union([
                    t.Literal("today"),
                    t.Literal("7d"),
                    t.Literal("30d"),
                    t.Literal("60d"),
                ]),
            ),
        }),
    },
);

export default usageRoutes;
