"use client";

import { dashboardPagesArray, type TabType } from "@/components/dashboard/pages";
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
import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardTabs: TabType[] = ["overview", "performance", "errors", "geography", "environment"];
const userTabs: TabType[] = ["profile", "projects", "usage", "billing"];

export function DashboardSidebar() {
    const pathname = usePathname();

    const dashboardPages = dashboardPagesArray.filter((page) => dashboardTabs.includes(page.tab as TabType));
    const userPages = dashboardPagesArray.filter((page) => userTabs.includes(page.tab as TabType));

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader>
                <div className="px-2 py-1">
                    <h1 className="text-xl font-bold">Rum Core</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarMenu>
                        {dashboardPages.map((page) => {
                            const url = `/dashboard/${page.tab}`;
                            const isActive = pathname === url;
                            return (
                                <SidebarMenuItem key={page.tab}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                    >
                                        <Link href={url} className="flex items-center gap-3">
                                            <page.icon className="h-4 w-4" />
                                            <span>{page.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarMenu>
                        {userPages.map((page) => {
                            const url = `/dashboard/${page.tab}`;
                            const isActive = pathname === url;
                            return (
                                <SidebarMenuItem key={page.tab}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                    >
                                        <Link href={url} className="flex items-center gap-3">
                                            <page.icon className="h-4 w-4" />
                                            <span>{page.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
}

export function DashboardSidebarTrigger() {
    return <SidebarTrigger className="lg:hidden" />
}
