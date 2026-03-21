"use client";

import { useProjects } from "@/hooks/api/use-projects";

export function UsagePage() {
    const { projects } = useProjects();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Usage</h1>
            <div>
                {projects?.map((project) => (
                    <div key={project.id}>{project.name}</div>
                ))}
            </div>
        </div>
    );
}
