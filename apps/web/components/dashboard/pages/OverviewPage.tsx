'use client'

import { useCurrentProject } from '@/hooks/api/use-projects'
import { useProjectTables, getTablesByTimeRange } from '@/hooks/api/use-project-tables'
import { tabTables } from '@/components/dashboard/pages'
import { TableGridRenderer } from '@/components/dashboard/TableGridRenderer'
import { useTimeRange } from '@/hooks/use-time-range'

export function OverviewPage() {
    const timeRange = useTimeRange((s) => s.getTimeRange('overview'))
    const setTimeRange = useTimeRange((s) => s.setTimeRange)
    const { projectId } = useCurrentProject()

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? '',
        tab: 'overview',
        timeRange
    })

    const tables = getTablesByTimeRange(tabTables['overview'], timeRange)

    return (
        <TableGridRenderer
            tableNames={tables}
            data={tableData}
            timeRange={timeRange}
            onTimeRangeChange={(range) => setTimeRange('overview', range)}
            onRefresh={mutate}
            isRefreshing={isLoading || isValidating}
        />
    )
}
