'use client'

import { useState } from 'react'
import { useCurrentProject } from '@/hooks/api/use-projects'
import { useProjectTables, getTablesByTimeRange } from '@/hooks/api/use-project-tables'
import { tabTables } from '@/components/dashboard/pages'
import { TimeRangeSelector } from '@/components/dashboard/TimeRangeSelector'
import { TableBox } from '@/components/dashboard/TableBox'
import type { TimeRange } from '@/types/api'

export function EndpointsPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>('24h')
    const { projectId } = useCurrentProject()

    const { tableData, isLoading, mutate } = useProjectTables({
        projectId: projectId ?? '',
        tab: 'endpoints',
        timeRange
    })

    const tables = getTablesByTimeRange(tabTables['endpoints'], timeRange)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {tables.map((tableName: string) => (
                    <TableBox
                        key={tableName}
                        title={tableName}
                        data={tableData?.[tableName] ?? []}
                        onRefresh={() => mutate()}
                        isRefreshing={isLoading}
                    />
                ))}
            </div>
        </div>
    )
}
