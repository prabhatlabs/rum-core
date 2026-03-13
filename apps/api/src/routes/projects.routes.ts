import Elysia, { t } from "elysia";
import { okResponse } from "../lib/response";
import { authMiddleware } from "../middleware/auth.middleware";
import { createProject, deleteProject, getProjects, updateProject } from "../services/projects.service";

const projectsRoutes = new Elysia({ prefix: '/projects' })
    .use(authMiddleware)
    .get('/', async ({ user }) => {
        const projects = await getProjects(user.id);
        return okResponse(projects);
    })
    .post('/', async ({ user, body }) => {
        const { origin, name } = body;
        const project = await createProject(user.id, origin, name, user.plan_limits.projects);
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
        const project = await updateProject(project_id, user.id, name, origin);
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
        const project = await deleteProject(project_id, user.id);
        return okResponse(project);
    }, {
        params: t.Object({
            id: t.String()
        })
    });

export default projectsRoutes;