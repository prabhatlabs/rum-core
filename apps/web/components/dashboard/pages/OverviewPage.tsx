"use client";

import { DataRenderer } from "@/components/dashboard/DataRenderer";
import { tabTables } from "@/components/dashboard/pages";
import {
    getTablesByTimeRange,
    useProjectTables,
} from "@/hooks/api/use-project-tables";
import { useCurrentProject } from "@/hooks/api/use-projects";
import { useTabState } from "@/hooks/use-tab-state";

export function OverviewPage() {
    const timeRange = useTabState((s) => s.getTimeRange("overview"));
    const setTimeRange = useTabState((s) => s.setTimeRange);
    const { projectId } = useCurrentProject();

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? "",
        tab: "overview",
        timeRange,
    });

    const tables = getTablesByTimeRange(tabTables["overview"], timeRange);

    return (
        <DataRenderer
            title="Overview"
            tableNames={tables}
            data={tableData}
            timeRange={timeRange}
            onTimeRangeChange={(range) => setTimeRange("overview", range)}
            onRefresh={mutate}
            isRefreshing={isLoading || isValidating}
            show="cards"
        />
    );
}
