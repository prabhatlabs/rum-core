import { DashboardSidebar, DashboardSidebarTrigger } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/hooks/useProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <ProtectedRoute>
                <div className="flex h-dvh w-screen">
                    <DashboardSidebar />
                    <main className="flex-1 overflow-auto p-6 w-full">
                        <div className="mb-4 lg:hidden">
                            <DashboardSidebarTrigger />
                        </div>
                        {children}
                    </main>
                </div>
            </ProtectedRoute>
        </SidebarProvider>
    );
}
