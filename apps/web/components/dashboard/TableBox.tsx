import { tableNames } from "@/components/dashboard/pages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDateTime, type TimeRange } from "@rum-core/shared";

interface TableBoxProps {
    title: string;
    data?: unknown[];
    className?: string;
    timeRange?: TimeRange;
    isLoading?: boolean;
    showTitle?: boolean;
}

export function columnNameFormatter(column: string): string {
    return column.replace("_pct", " (%)").replaceAll("_", " ");
}

export function isTimestamp(value: number): boolean {
    return value > 1_000_000_000_000;
}

function formatValue(value: unknown, showDate: boolean, showTime: boolean): string {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "number") {
        if (isTimestamp(value)) {
            return formatDateTime(value, showDate, showTime);
        }
        return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }
    const num = Number(value);
    if (!isNaN(num) && value !== "") {
        if (isTimestamp(num)) {
            return formatDateTime(num, showDate, showTime);
        }
        return Number.isInteger(num) ? String(num) : num.toFixed(2);
    }
    return String(value);
}

export function TableBox({ title, data = [], className, timeRange = "24h", isLoading, showTitle = true }: TableBoxProps) {
    const isHourly = timeRange === "12h" || timeRange === "24h";
    const isDaily = timeRange === "7d" || timeRange === "30d";
    const showDate = !isHourly;
    const showTime = !isDaily;
    const firstRow = data[0];
    const columns = firstRow ? Object.keys(firstRow) : [];

    return (
        <Card className={cn("", className)}>
            {showTitle && (
                <CardHeader className="">
                    <CardTitle>{tableNames[title] ?? title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className="">
                <div className="h-[calc(100dvh-330px)] overflow-auto">
                    <Table className="min-w-full h-full mb-4 border">
                        <TableHeader>
                            <TableRow
                                className={
                                    columns.length === 0
                                        ? "border-b"
                                        : undefined
                                }
                            >
                                {columns.length === 0 ? (
                                    <TableHead>Column</TableHead>
                                ) : (
                                    columns.map((col, key) => (
                                        <TableHead
                                            key={key}
                                            className={`capitalize ${key !== 0 ? "border-l" : ""}`}
                                        >
                                            {columnNameFormatter(col)}
                                        </TableHead>
                                    ))
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <>
                                    {Array.from({ length: 2 }).map((_, rowIdx) => (
                                        <TableRow key={rowIdx}>
                                            {Array.from({ length: 5 }).map((_, colIdx) => (
                                                <TableCell key={colIdx} className={colIdx !== 0 ? "border-l" : ""}>
                                                    <Skeleton className="h-4 w-full rounded" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length || 1}
                                        className="text-center text-muted-foreground"
                                    >
                                        No data available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, idx) => (
                                    <TableRow key={idx}>
                                        {columns.map((col, key) => (
                                            <TableCell key={col} className={key !== 0 ? "border-l" : ""}>
                                                {formatValue(
                                                    (
                                                        row as Record<
                                                            string,
                                                            unknown
                                                        >
                                                    )[col],
                                                    showDate,
                                                    showTime,
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
