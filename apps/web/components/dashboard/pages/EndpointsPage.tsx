"use client";

import { tabTables } from "@/components/dashboard/pages";
import { DataRenderer } from "@/components/dashboard/DataRenderer";
import {
    getTablesByTimeRange,
    useProjectTables,
} from "@/hooks/api/use-project-tables";
import { useCurrentProject } from "@/hooks/api/use-projects";
import { useTabState } from "@/hooks/use-tab-state";

export function EndpointsPage() {
    const timeRange = useTabState((s) => s.getTimeRange("endpoints"));
    const setTimeRange = useTabState((s) => s.setTimeRange);
    const selectedTable = useTabState((s) => s.getSelectedTable("endpoints"));
    const setSelectedTable = useTabState((s) => s.setSelectedTable);
    const { projectId } = useCurrentProject();

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? "",
        tab: "endpoints",
        timeRange,
    });

    const tables = getTablesByTimeRange(tabTables["endpoints"], timeRange);

    return (
        <DataRenderer
            title="Endpoints"
            tableNames={tables}
            data={tableData}
            timeRange={timeRange}
            onTimeRangeChange={(range) => setTimeRange("endpoints", range)}
            onRefresh={mutate}
            isRefreshing={isLoading || isValidating}
            selectedTable={selectedTable}
            onTableSelect={(table) => setSelectedTable("endpoints", table)}
        />
    );
}
