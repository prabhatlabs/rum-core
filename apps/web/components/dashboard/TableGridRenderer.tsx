import { TableBox } from "@/components/dashboard/TableBox"
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector"
import { RefreshButton } from "@/components/dashboard/RefreshButton"
import type { TimeRange } from "@rum-core/shared";

interface TableGridRendererProps {
    tableNames: string[]
    data?: Record<string, unknown[]>
    timeRange: TimeRange
    onTimeRangeChange: (value: TimeRange) => void
    onRefresh: () => void
    isRefreshing: boolean
}

export function TableGridRenderer({ tableNames, data, timeRange, onTimeRangeChange, onRefresh, isRefreshing }: TableGridRendererProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
                <RefreshButton onRefresh={onRefresh} isRefreshing={isRefreshing} />
                <TimeRangeSelector value={timeRange} onChange={onTimeRangeChange} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {tableNames.map((tableName) => (
                    <TableBox
                        key={tableName}
                        title={tableName}
                        data={data?.[tableName] ?? []}
                        timeRange={timeRange}
                    />
                ))}
            </div>
        </div>
    )
}
