'use client'

import { useCurrentProject } from '@/hooks/api/use-projects'
import { useProjectTables, getTablesByTimeRange } from '@/hooks/api/use-project-tables'
import { tabTables } from '@/components/dashboard/pages'
import { TableGridRenderer } from '@/components/dashboard/TableGridRenderer'
import { useTimeRange } from '@/hooks/use-time-range'

export function GeographyPage() {
    const timeRange = useTimeRange((s) => s.getTimeRange('geography'))
    const setTimeRange = useTimeRange((s) => s.setTimeRange)
    const { projectId } = useCurrentProject()

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? '',
        tab: 'geography',
        timeRange
    })

    const tables = getTablesByTimeRange(tabTables['geography'], timeRange)

    return (
        <TableGridRenderer
            tableNames={tables}
            data={tableData}
            timeRange={timeRange}
            onTimeRangeChange={(range) => setTimeRange('geography', range)}
            onRefresh={mutate}
            isRefreshing={isLoading || isValidating}
        />
    )
}
