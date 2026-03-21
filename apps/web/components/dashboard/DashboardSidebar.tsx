"use client";

import {
    dashboardPagesArray,
    type DashboardPage,
    type TabType,
} from "@/components/dashboard/pages";
import { Progress } from "@/components/ui/progress";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useProjects } from "@/hooks/api/use-projects";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../Logo";
import { ProjectSelector } from "./DashboardNavbar";

export function DashboardSidebar() {
    const pathname = usePathname();
    const { currentProject } = useProjects();

    const currTab = (pathname.split("/")[2] || "overview") as TabType;

    const projectPages = dashboardPagesArray.filter(
        (page) => page.grp === "projects",
    );
    const userPages = dashboardPagesArray.filter((page) => page.grp === "user");

    function renderMenuItem(page: DashboardPage) {
        const url = `/dashboard/${page.tab}${currentProject ? `?project_id=${currentProject.id}` : ""}`;
        const isActive = currTab === page.tab;
        return (
            <SidebarMenuItem key={page.tab}>
                <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={url} className="flex items-center gap-3">
                        <page.icon className="h-4 w-4" />
                        <span>{page.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader>
                <div className="flex gap-2 items-center">
                    <Logo />
                    <h1 className="text-foreground font-bold text-xl">RUM CORE</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <ProjectSelector className="sm:hidden w-full" />
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarMenu>
                        {projectPages.map((page) => renderMenuItem(page))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarMenu>
                        {userPages.map((page) => renderMenuItem(page))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="gap-4 py-4">
                <UsageProgressBars />
                <div className="flex gap-1 text-xs text-muted-foreground">
                    <span>*</span>
                    <span>
                        Hourly data refreshes every hour. Data over 24h
                        refreshes once a day.
                    </span>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

export function DashboardSidebarTrigger() {
    return <SidebarTrigger className="lg:hidden" />;
}

function UsageProgressBars() {
    const { user } = useAuth();
    const { projects } = useProjects();

    const callsLimit = user?.plan_limits.calls_per_day ?? 0;
    const projectsLimit = user?.plan_limits.projects ?? 0;

    const callsUsed =
        projects?.reduce((sum, p) => sum + (p.usage[0]?.calls_used || 0), 0) ??
        0;
    const projectsUsed = projects?.length ?? 0;

    const callsPercent = callsLimit > 0 ? (callsUsed / callsLimit) * 100 : 0;
    const projectsPercent =
        projectsLimit > 0 ? (projectsUsed / projectsLimit) * 100 : 0;

    return (
        <div className="space-y-3 px-2 py-1">
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Daily Calls</span>
                    <span className="font-medium">
                        {callsUsed.toLocaleString()} /{" "}
                        {callsLimit.toLocaleString()}
                    </span>
                </div>
                <Progress value={Math.min(callsPercent, 100)} />
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-medium">
                        {projectsUsed} / {projectsLimit}
                    </span>
                </div>
                <Progress value={Math.min(projectsPercent, 100)} />
            </div>
        </div>
    );
}
