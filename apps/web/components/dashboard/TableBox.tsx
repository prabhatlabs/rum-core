import { tableNames } from "@/components/dashboard/pages"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"

interface TableBoxProps {
    title: string
    data?: unknown[]
    onRefresh?: () => void
    isRefreshing?: boolean
    className?: string
}

function columnNameFormatter(column: string): string {
    return column.replaceAll('_', ' ')
}

export function TableBox({ title, data = [], onRefresh, isRefreshing, className }: TableBoxProps) {
    const firstRow = data[0]
    const columns = firstRow ? Object.keys(firstRow) : []

    return (
        <Card className={cn("gap-0", className)}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle>{tableNames[title] ?? title}</CardTitle>
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`size-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className={columns.length === 0 ? 'border-b' : undefined}>
                            {columns.length === 0 ? (
                                <TableHead>Column</TableHead>
                            ) : (
                                columns.map((col) => (
                                    <TableHead key={col} className="capitalize">{columnNameFormatter(col)}</TableHead>
                                ))
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length || 1} className="text-center text-muted-foreground">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, idx) => (
                                <TableRow key={idx}>
                                    {columns.map((col) => (
                                        <TableCell key={col}>{String((row as Record<string, unknown>)[col] ?? '')}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
