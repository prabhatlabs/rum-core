"use client";

import { DashboardSidebarTrigger } from "@/components/dashboard/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useKeepCurrentProjectInSync,
    useProjects,
} from "@/hooks/api/use-projects";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/utils";
import { Folder, Plus } from "lucide-react";
import { Suspense } from "react";
import { ThemeToggle } from "../ui/theme-toggle";

export function DashboardNavbar() {
    return (
        <nav className="flex h-14 items-center justify-between border-b px-2 sm:px-4">
            <div className="flex items-center gap-2">
                <div className="lg:hidden">
                    <DashboardSidebarTrigger />
                </div>
                <Suspense>
                    <ProjectSelector />
                </Suspense>
                <TotalCallUsage />
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserDropdown />
            </div>
        </nav>
    );
}

function ProjectSelector() {
    const { projects, isLoading, currentProject, setCurrentProject } =
        useProjects();
    const { openAddEditProject } = useDialog();
    useKeepCurrentProjectInSync();

    return (
        <Select
            value={currentProject?.id}
            onValueChange={(value) => {
                setCurrentProject(value);
            }}
        >
            <SelectTrigger className="max-w-50 w-full" disabled={isLoading}>
                <SelectValue placeholder="Select Project">
                    <div className="flex items-center gap-2">
                        <Folder className="size-4 text-primary" />
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">
                                {isLoading
                                    ? "Loading..."
                                    : (currentProject?.name ??
                                      "Select Project")}
                            </span>
                        </div>
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent
                side="bottom"
                align="start"
                position="popper"
                className="max-w-64 w-full"
            >
                {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                            <Folder className="size-4" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {project.name}
                                </span>
                                <span className="text-xs text-muted-foreground truncate w-50">
                                    {project.origin}
                                </span>
                            </div>
                        </div>
                    </SelectItem>
                ))}
                {(projects?.length ?? 0) > 0 && (
                    <SelectSeparator className="my-1" />
                )}
                <Button
                    onClick={() => openAddEditProject()}
                    variant={"ghost"}
                    className="flex w-full justify-start"
                >
                    <Plus />
                    <span>Create new project</span>
                </Button>
            </SelectContent>
        </Select>
    );
}

function TotalCallUsage() {
    const { user } = useAuth();
    const { projects } = useProjects();
    const totalCalls =
        projects?.reduce(
            (acc, project) => acc + project.usage[0]?.calls_used || 0,
            0,
        ) || 0;
    const maxCalls = user?.plan_limits.calls_per_day || 0;
    const percentage = (totalCalls / (maxCalls || 1)) * 100;
    const borderClass =
        percentage >= 90
            ? "border-destructive"
            : percentage >= 70
              ? "border-warning"
              : "border-success";
    return (
        <Button variant="outline">
            <span
                className={cn("border-b", borderClass)}
            >{`${totalCalls} / ${maxCalls}`}</span>
        </Button>
    );
}

function UserDropdown() {
    const { user, logout } = useAuth();
    const avatarUrl = user?.avatar_url;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size={"icon"} className="relative">
                    <Avatar className="">
                        <AvatarImage
                            src={avatarUrl ?? ""}
                            alt={user?.name ?? "User"}
                            className="object-cover"
                        />
                        <AvatarFallback>
                            {user?.name?.[0] ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col items-center gap-3 p-4">
                    <Avatar className="size-25">
                        <AvatarImage
                            src={avatarUrl ?? ""}
                            alt={user?.name ?? "User"}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-4xl">
                            {user?.name?.[0] ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1.5 items-center text-center">
                        <p className="text-sm font-medium leading-none">
                            {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                            ({user?.provider}) (plan: {user?.plan.type})
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 p-2 pt-0">
                    <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => logout()}
                    >
                        Log out
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
