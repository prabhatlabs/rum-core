"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardDialogs } from "@/components/dashboard/dialogs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/hooks/use-protected-route";
import { fetcher } from "@/lib/fetcher";
import { SWRConfig } from "swr";

const swrCache = new Map();

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            {/* Auth call only needs revalidation on focus  */}
            <SWRConfig
                value={{
                    revalidateOnFocus: false,
                    dedupingInterval: 90000,
                    provider: () => swrCache,
                    fetcher: fetcher
                }}
            >
                <ProtectedRoute>
                    <div className="flex h-dvh w-screen">
                        <DashboardSidebar />
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <DashboardNavbar />
                            <main className="flex-1 overflow-auto px-6 py-4 w-full">
                                {children}
                            </main>
                        </div>
                    </div>
                    <DashboardDialogs />
                </ProtectedRoute>
            </SWRConfig>
        </SidebarProvider>
    );
}
