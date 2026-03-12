"use client";

import ProjectKey from "@/components/ProjectKey";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
    PencilSimpleIcon,
    TrashIcon
} from "@phosphor-icons/react";
import { Ellipsis, Folder, Plus } from "lucide-react";
import { DashboardDialogs } from "../dialogs";

export function ProjectsPage() {
    const { projects, isLoading, setCurrentProject } =
        useProjects();
    const { openAddEditProject, openDeleteProject } = useDialog();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <Button onClick={() => openAddEditProject()}>
                    <Plus />
                    Add Project
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Usage (today)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                Loading...
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
                                <TableCell className="font-medium">
                                    {project.name}
                                </TableCell>
                                <TableCell>
                                    <ProjectKey
                                        projectKey={project.project_key}
                                    />
                                </TableCell>
                                <TableCell>{project.origin}</TableCell>
                                <TableCell>0</TableCell>
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
