import PageRenderer from "@/components/dashboard/PageRenderer";
import { dashboardPagesObj } from "@/components/dashboard/pages";

export default function DashboardRootPage() {
    return <PageRenderer page={dashboardPagesObj.overview} />;
}
