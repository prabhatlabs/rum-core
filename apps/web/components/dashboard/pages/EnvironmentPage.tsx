'use client'

import { tabTables } from '@/components/dashboard/pages'
import { DataRenderer } from '@/components/dashboard/DataRenderer'
import { getTablesByTimeRange, useProjectTables } from '@/hooks/api/use-project-tables'
import { useCurrentProject } from '@/hooks/api/use-projects'
import { useTabState } from '@/hooks/use-tab-state'

export function EnvironmentPage() {
    const timeRange = useTabState((s) => s.getTimeRange('environment'))
    const setTimeRange = useTabState((s) => s.setTimeRange)
    const selectedTable = useTabState((s) => s.getSelectedTable('environment'))
    const setSelectedTable = useTabState((s) => s.setSelectedTable)
    const { projectId } = useCurrentProject()

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? '',
        tab: 'environment',
        timeRange
    })

    const tables = getTablesByTimeRange(tabTables['environment'], timeRange)

    return (
        <DataRenderer
            title="Environment"
            tableNames={tables}
            data={tableData}
            timeRange={timeRange}
            onTimeRangeChange={(range) => setTimeRange('environment', range)}
            onRefresh={mutate}
            isRefreshing={isLoading || isValidating}
            selectedTable={selectedTable}
            onTableSelect={(table) => setSelectedTable('environment', table)}
        />
    )
}
