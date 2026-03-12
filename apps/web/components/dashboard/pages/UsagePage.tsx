"use client";

import { useProjects } from "@/hooks/api/use-projects";

export function UsagePage() {
    const { projects } = useProjects();
    return (
        <div>
            <h1>Usage</h1>
            <div>
                {projects?.map((project) => (
                    <div key={project.id}>{project.name}</div>
                ))}
            </div>
        </div>
    );
}
