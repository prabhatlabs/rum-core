import { TableBox } from "@/components/dashboard/TableBox"
import type { TimeRange } from "@rum-core/shared";

interface TableGridRendererProps {
    tableNames: string[]
    data?: Record<string, unknown[]>
    timeRange?: TimeRange
}

export function TableGridRenderer({ tableNames, data, timeRange }: TableGridRendererProps) {
    return (
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
    )
}
