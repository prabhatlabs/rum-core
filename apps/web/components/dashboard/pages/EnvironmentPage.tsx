'use client'

import { useCurrentProject } from '@/hooks/api/use-projects'
import { useProjectTables, getTablesByTimeRange } from '@/hooks/api/use-project-tables'
import { tabTables } from '@/components/dashboard/pages'
import { TableGridRenderer } from '@/components/dashboard/TableGridRenderer'
import { useTimeRange } from '@/hooks/use-time-range'

export function EnvironmentPage() {
    const timeRange = useTimeRange((s) => s.getTimeRange('environment'))
    const setTimeRange = useTimeRange((s) => s.setTimeRange)
    const { projectId } = useCurrentProject()

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? '',
        tab: 'environment',
        timeRange
    })

    const tables = getTablesByTimeRange(tabTables['environment'], timeRange)

    return (
        <TableGridRenderer
            tableNames={tables}
            data={tableData}
            timeRange={timeRange}
            onTimeRangeChange={(range) => setTimeRange('environment', range)}
            onRefresh={mutate}
            isRefreshing={isLoading || isValidating}
        />
    )
}
