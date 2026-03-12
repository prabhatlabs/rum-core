import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardDialogs } from "@/components/dashboard/dialogs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/hooks/use-protected-route";

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
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <DashboardNavbar />
                        <main className="flex-1 overflow-auto px-6 py-4 w-full">
                            {children}
                        </main>
                    </div>
                </div>
                <DashboardDialogs />
            </ProtectedRoute>
        </SidebarProvider>
    );
}
