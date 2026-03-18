import { projectsService, rollupService } from "@rum-core/db";
import { okResponse, type TimeRange } from "@rum-core/shared";
import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth.middleware";

const timeRangeTransform = t.Transform(t.String())
    .Decode((value) => {
        const range = value as TimeRange;
        return range;
    }).Encode((value) => {
        const range = value as TimeRange;
        return range
    })

const projectsRoutes = new Elysia({ prefix: '/projects' })
    .use(authMiddleware)
    .get('/', async ({ user }) => {
        const projects = await projectsService.getProjects(user.id);
        return okResponse(projects);
    })
    .post('/data/:id', async ({ user, params, body }) => {
        const user_id = user.id;
        const project_id = params.id;
        const { time_range, tables } = body;
        const data = await rollupService.fetchRollupTables(user_id, project_id, time_range, tables);

        return okResponse(data);
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            time_range: timeRangeTransform,
            tables: t.Array(t.String())
        })
    })
    .post('/', async ({ user, body }) => {
        const { origin, name } = body;
        const project = await projectsService.createProject(user.id, origin, name, user.plan_limits.projects);
        return okResponse(project);
    }, {
        body: t.Object({
            origin: t.String(),
            name: t.String()
        })
    })
    .patch('/:id', async ({ user, params, body }) => {
        const project_id = params.id;
        const { origin, name } = body;
        const project = await projectsService.updateProject(project_id, user.id, name, origin);
        return okResponse(project);
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            origin: t.String(),
            name: t.String()
        })
    })
    .delete('/:id', async ({ user, params }) => {
        const project_id = params.id;
        const project = await projectsService.deleteProject(project_id, user.id);
        return okResponse(project);
    }, {
        params: t.Object({
            id: t.String()
        })
    });

export default projectsRoutes;