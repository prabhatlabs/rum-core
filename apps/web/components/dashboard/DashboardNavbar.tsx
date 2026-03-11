"use client";

import { DashboardSidebarTrigger } from "@/components/dashboard/DashboardSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { ThemeToggle } from "../ui/theme-toggle";

export function DashboardNavbar() {
    return (
        <nav className="flex h-14 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
                <div className="lg:hidden">
                    <DashboardSidebarTrigger />
                </div>
                <h1 className="text-xl font-bold">Rum Core</h1>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <UserDropdown />
            </div>
        </nav>
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
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={user?.name ?? "User"}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : null}
                        <AvatarFallback>
                            {user?.name?.[0] ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col items-center gap-3 p-4">
                    <Avatar className="size-25">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={user?.name ?? "User"}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : null}
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
