'use client'

import { tabTables } from '@/components/dashboard/pages'
import { TableRenderer } from '@/components/dashboard/TableRenderer'
import { getTablesByTimeRange, useProjectTables } from '@/hooks/api/use-project-tables'
import { useCurrentProject } from '@/hooks/api/use-projects'
import { useTabState } from '@/hooks/use-tab-state'

export function OverviewPage() {
    const timeRange = useTabState((s) => s.getTimeRange('overview'))
    const setTimeRange = useTabState((s) => s.setTimeRange)
    const selectedTable = useTabState((s) => s.getSelectedTable('overview'))
    const setSelectedTable = useTabState((s) => s.setSelectedTable)
    const { projectId } = useCurrentProject()

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? '',
        tab: 'overview',
        timeRange
    })

    const tables = getTablesByTimeRange(tabTables['overview'], timeRange)

    return (
        <TableRenderer
            tableNames={tables}
            data={tableData}
            timeRange={timeRange}
            onTimeRangeChange={(range) => setTimeRange('overview', range)}
            onRefresh={mutate}
            isRefreshing={isLoading || isValidating}
            selectedTable={selectedTable}
            onTableSelect={(table) => setSelectedTable('overview', table)}
        />
    )
}
