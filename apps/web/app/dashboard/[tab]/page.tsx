import PageRenderer from "@/components/dashboard/PageRenderer";
import {
    dashboardPagesArray,
    dashboardPagesObj,
    type TabType,
} from "@/components/dashboard/pages";

export function generateStaticParams() {
    return dashboardPagesArray.map((page) => ({ tab: page.tab }));
}

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ tab: string }>;
}) {
    const { tab } = await params;

    const page = dashboardPagesObj[tab as TabType];

    if (!page) {
        return (
            <div>
                <h1>Page not found</h1>
            </div>
        );
    }

    return <PageRenderer page={page} />;
}
