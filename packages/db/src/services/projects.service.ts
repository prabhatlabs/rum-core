import { APIErrorResponse } from "@rum-core/shared";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getMainDB } from "../maindb/client";
import { projects, usage } from "../maindb/schema";
import { isValidOrigin } from "../utils/links";

// returns all projects, as even for pro plan, cap is at 8!
export async function getProjects(user_id: string) {
    const db = getMainDB();
    return await db.query.projects.findMany({
        where: eq(usage.user_id, user_id),
        with: {
            usage: {
                where(fields, operators) {
                    return operators.eq(fields.date, sql`CURRENT_DATE`);
                },
            },
        },
    });
}

export async function getProject(project_id: string, user_id: string) {
    const db = getMainDB();
    return await db.query.projects.findFirst({
        where(fields, operators) {
            return operators.and(
                operators.eq(fields.id, project_id),
                operators.eq(fields.user_id, user_id),
            );
        },
        with: {
            usage: {
                where(fields, operators) {
                    return operators.eq(fields.date, sql`CURRENT_DATE`);
                },
            },
        },
    });
}

export async function createProject(
    user_id: string,
    origin: string,
    name: string,
    maxProjectCountAllowed = 0,
) {
    const db = getMainDB();
    const existing = await db.$count(
        projects,
        sql`projects.user_id = ${user_id}`,
    );
    if (maxProjectCountAllowed <= existing)
        throw new APIErrorResponse(
            "LimitExceeded",
            "Limit exceeded",
            "You have reached the maximum number of projects",
            400,
        );

    const isValid = isValidOrigin(origin);
    if (!isValid)
        throw new APIErrorResponse(
            "ValueError",
            "Invalid origin",
            "Origin is not a valid URL",
            400,
        );

    const projectKey = nanoid(24);
    const [project] = await db
        .insert(projects)
        .values({ user_id, project_key: projectKey, origin, name })
        .returning();

    if (!project) {
        throw new APIErrorResponse(
            "InternalServerError",
            "Something went wrong",
            "Something went wrong",
            500,
        );
    }
    return { ...project, usage: [] };
}

export async function updateProject(
    project_id: string,
    user_id: string,
    name: string,
    origin: string,
) {
    const isValid = isValidOrigin(origin);
    if (!isValid)
        throw new APIErrorResponse(
            "ValueError",
            "Invalid origin",
            "Origin is not a valid URL",
            400,
        );

    const db = getMainDB();
    const [project] = await db
        .update(projects)
        .set({ name, origin })
        .where(and(eq(projects.id, project_id), eq(projects.user_id, user_id)))
        .returning();

    if (!project) {
        throw new APIErrorResponse(
            "InternalServerError",
            "Something went wrong",
            "Something went wrong",
            500,
        );
    }
    return { ...project, usage: [] };
}

export async function deleteProject(project_id: string, user_id: string) {
    const db = getMainDB();
    const [project] = await db
        .delete(projects)
        .where(and(eq(projects.id, project_id), eq(projects.user_id, user_id)))
        .returning();
    return !!project;
}
