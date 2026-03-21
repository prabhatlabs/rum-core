"use client";

import { LoadingSpinner } from "@/components/Loading";
import ProjectKey from "@/components/ProjectKey";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useProjects } from "@/hooks/api/use-projects";
import { useDialog } from "@/hooks/use-dialog";
import type { Project } from "@/types/api";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { Ellipsis, Folder, Plus } from "lucide-react";
import { DashboardDialogs } from "../dialogs";

export function ProjectsPage() {
    const { projects, isLoading, setCurrentProject } = useProjects();
    const { openAddEditProject, openDeleteProject } = useDialog();
    
    const totalCalls = projects?.reduce((acc, project) => acc + (project.usage[0]?.calls_used || 0), 0) || 0;

    function renderUsageBar(project: Project) {
        const calls = project.usage[0]?.calls_used || 0;
        const value = (calls / (totalCalls || 1)) * 100;
        return (
            <Label>
                <span>
                    {calls} / {totalCalls}
                </span>
                <Progress value={value} className="w-24" />
            </Label>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Projects</h1>
            <div className="flex items-center justify-end">
                <Button onClick={() => openAddEditProject()}>
                    <Plus />
                    Add Project
                </Button>
            </div>

            <Table className="border mb-4">
                <TableHeader>
                    <TableRow>
                        <TableHead className="border-r">Name</TableHead>
                        <TableHead className="border-r">Key</TableHead>
                        <TableHead className="border-r">Origin</TableHead>
                        <TableHead className="border-r">Usage out of Total (today)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <LoadingSpinner />
                            </TableCell>
                        </TableRow>
                    ) : projects?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No projects found
                            </TableCell>
                        </TableRow>
                    ) : (
                        projects?.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium border-r">
                                    {project.name}
                                </TableCell>
                                <TableCell className="border-r">
                                    <ProjectKey
                                        projectKey={project.project_key}
                                    />
                                </TableCell>
                                <TableCell className="border-r">{project.origin}</TableCell>
                                <TableCell className="border-r">{renderUsageBar(project)}</TableCell>
                                <TableCell className="text-right">
                                    <ActionDropdown
                                        onEdit={() =>
                                            openAddEditProject(project.id)
                                        }
                                        onDelete={() =>
                                            openDeleteProject(project.id)
                                        }
                                        onSelect={() =>
                                            setCurrentProject(project.id)
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <DashboardDialogs />
        </div>
    );
}

function ActionDropdown({
    onDelete,
    onEdit,
    onSelect,
}: {
    onDelete: () => void;
    onEdit: () => void;
    onSelect: () => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onSelect}>
                    <Folder />
                    Select
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                    <PencilSimpleIcon />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive"
                >
                    <TrashIcon />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
