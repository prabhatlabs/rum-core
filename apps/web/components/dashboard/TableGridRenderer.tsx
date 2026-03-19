import { TableBox } from "@/components/dashboard/TableBox"

interface TableGridRendererProps {
    tableNames: string[]
    data?: Record<string, unknown[]>
}

export function TableGridRenderer({ tableNames, data }: TableGridRendererProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {tableNames.map((tableName) => (
                <TableBox
                    key={tableName}
                    title={tableName}
                    data={data?.[tableName] ?? []}
                />
            ))}
        </div>
    )
}
