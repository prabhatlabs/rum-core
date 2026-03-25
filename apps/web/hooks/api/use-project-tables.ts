import { tabTables, type TabType } from "@/components/dashboard/pages";
import { fetcher } from "@/lib/fetcher";
import type { TimeRange } from "@rum-core/shared";
import useSWR from "swr";

export type ProjectDataParams = {
    projectId: string;
    tab: Exclude<TabType, "projects" | "billing" | "usage">;
    timeRange: TimeRange;
};

export type ProjectTableData = Record<string, unknown[]>;

export function getTablesByTimeRange(
    tables: string[],
    timeRange: TimeRange,
): string[] {
    const isHourly = timeRange === "12h" || timeRange === "24h";
    return tables.filter((table) =>
        isHourly ? table.includes("hourly") : table.includes("daily"),
    );
}

export function useProjectTables(params: ProjectDataParams) {
    const { projectId, tab, timeRange } = params;
    const allTables = tabTables[tab];
    const tables = getTablesByTimeRange(allTables, timeRange);

    const swrKey =
        projectId && tables?.length > 0
            ? JSON.stringify({
                  url: "/projects/data",
                  projectId,
                  timeRange,
                  tables,
              })
            : null;

    const { data, isLoading, isValidating, error, mutate } =
        useSWR<ProjectTableData>(swrKey, () =>
            fetcher<ProjectTableData>(`/projects/data/${projectId}`, {
                method: "POST",
                body: { time_range: timeRange, tables },
            }),
        );

    return {
        tableData: data,
        isLoading,
        isValidating,
        error,
        mutate,
    };
}
