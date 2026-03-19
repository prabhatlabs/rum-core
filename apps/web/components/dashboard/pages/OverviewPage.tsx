'use client'

import { useState } from 'react'
import { useCurrentProject } from '@/hooks/api/use-projects'
import { useProjectTables, getTablesByTimeRange } from '@/hooks/api/use-project-tables'
import { tabTables } from '@/components/dashboard/pages'
import { TimeRangeSelector } from '@/components/dashboard/TimeRangeSelector'
import { RefreshButton } from '@/components/dashboard/RefreshButton'
import { TableGridRenderer } from '@/components/dashboard/TableGridRenderer'
import type { TimeRange } from '@rum-core/shared'

export function OverviewPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>('24h')
    const { projectId } = useCurrentProject()

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? '',
        tab: 'overview',
        timeRange
    })

    const tables = getTablesByTimeRange(tabTables['overview'], timeRange)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
                <RefreshButton onRefresh={() => mutate()} isRefreshing={isLoading || isValidating} />
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
            <TableGridRenderer tableNames={tables} data={tableData} timeRange={timeRange} />
        </div>
    )
}
