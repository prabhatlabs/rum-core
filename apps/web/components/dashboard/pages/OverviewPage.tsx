'use client'

import { tabTables, tableNames } from '@/components/dashboard/pages'
import { RefreshButton } from '@/components/dashboard/RefreshButton'
import { columnNameFormatter, isTimestamp } from '@/components/dashboard/TableBox'
import { TimeRangeSelector } from '@/components/dashboard/TimeRangeSelector'
import { TotalCard } from '@/components/dashboard/TotalCard'
import { getTablesByTimeRange, useProjectTables } from '@/hooks/api/use-project-tables'
import { useCurrentProject } from '@/hooks/api/use-projects'
import { useTabState } from '@/hooks/use-tab-state'

function sumField(rows: unknown[], field: string): number {
    return rows.reduce<number>((sum, row) => {
        const val = (row as Record<string, unknown>)[field]
        return sum + (typeof val === 'number' ? val : Number(val) || 0)
    }, 0)
}

const TIMING_FIELDS = new Set(['avg_ttfb', 'avg_duration', 'avg_lcp', 'avg_fcp', 'avg_inp'])

export function OverviewPage() {
    const timeRange = useTabState((s) => s.getTimeRange('overview'))
    const setTimeRange = useTabState((s) => s.setTimeRange)
    const { projectId } = useCurrentProject()

    const { tableData, isLoading, isValidating, mutate } = useProjectTables({
        projectId: projectId ?? '',
        tab: 'overview',
        timeRange
    })

    const tables = getTablesByTimeRange(tabTables['overview'], timeRange)
    const loading = isLoading || isValidating

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end gap-2">
                <TimeRangeSelector
                    value={timeRange}
                    onChange={(range) => setTimeRange('overview', range)}
                />
                <RefreshButton
                    onRefresh={mutate}
                    isRefreshing={loading}
                />
            </div>
            {tables.map(table => {
                const rows = (tableData?.[table] ?? []) as unknown[]
                const columns = rows[0] ? Object.keys(rows[0] as Record<string, unknown>) : []
                const label = tableNames[table] ?? table
                const numericColumns = columns.filter(col => {
                    const val = (rows[0] as Record<string, unknown>)[col]
                    if (typeof val !== 'number') return false
                    return !isTimestamp(val)
                })

                return (
                    <div key={table} className="space-y-2">
                        <h2 className="text-lg font-semibold">{label}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                            {numericColumns.map(col => (
                                <TotalCard
                                    key={col}
                                    title={columnNameFormatter(col)}
                                    value={rows.length > 0 ? sumField(rows, col) : null}
                                    unit={TIMING_FIELDS.has(col) ? 'ms' : undefined}
                                    isLoading={loading}
                                />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
