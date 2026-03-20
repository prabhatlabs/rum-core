import { tableNames } from "@/components/dashboard/pages";
import { RefreshButton } from "@/components/dashboard/RefreshButton";
import {
    columnNameFormatter,
    isTimestamp,
    TableBox,
} from "@/components/dashboard/TableBox";
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import {
    aggregateField,
    TotalCard,
    TotalCardSkeleton,
    unitForField,
} from "@/components/dashboard/TotalCard";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { TimeRange } from "@rum-core/shared";

type ShowMode = "table" | "cards" | "both";

interface DataRendererProps {
    title?: string;
    tableNames: string[];
    data?: Record<string, unknown[]>;
    timeRange: TimeRange;
    onTimeRangeChange: (value: TimeRange) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    selectedTable?: string | null;
    onTableSelect?: (table: string | null) => void;
    show?: ShowMode;
}

export function DataRenderer({
    title,
    tableNames: tables,
    data,
    timeRange,
    onTimeRangeChange,
    onRefresh,
    isRefreshing,
    selectedTable,
    onTableSelect,
    show = "both",
}: DataRendererProps) {
    const activeTable =
        selectedTable && tables.includes(selectedTable)
            ? selectedTable
            : (tables[0] ?? null);

    const showTable = show === "table" || show === "both";
    const showCards = show === "cards" || show === "both";
    const cardTables = showCards
        ? show === "cards"
            ? tables
            : activeTable
              ? [activeTable]
              : []
        : [];

    const activeLabel = activeTable
        ? (tableNames[activeTable] ?? activeTable)
        : null;

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold">{title || ""}</h1>
                    {activeLabel && show !== "cards" && (
                        <p className="text-muted-foreground text-sm">
                            {activeLabel}
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2">
                    {showTable && onTableSelect && (
                        <Select
                            value={activeTable ?? ""}
                            onValueChange={(v) => onTableSelect(v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select table" />
                            </SelectTrigger>
                            <SelectContent>
                                {tables.map((table) => (
                                    <SelectItem key={table} value={table}>
                                        {tableNames[table] ?? table}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <TimeRangeSelector
                        value={timeRange}
                        onChange={onTimeRangeChange}
                    />
                    <RefreshButton
                        onRefresh={onRefresh}
                        isRefreshing={isRefreshing}
                    />
                </div>
            </div>
            {showCards && cardTables.length > 0 && (
                <div className="space-y-6">
                    {cardTables.map((table) => {
                        const rows = (data?.[table] ?? []) as unknown[];
                        const columns = rows[0]
                            ? Object.keys(rows[0] as Record<string, unknown>)
                            : [];
                        const numericColumns = columns.filter((col) => {
                            const val = (rows[0] as Record<string, unknown>)[
                                col
                            ];
                            if (typeof val !== "number") return false;
                            return !isTimestamp(val);
                        });

                        return (
                            <div key={table} className="space-y-2">
                                {show === "cards" && (
                                    <p className="text-muted-foreground text-sm">
                                        {tableNames[table]}
                                    </p>
                                )}
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                                    {isRefreshing ? (
                                        <>
                                            <TotalCardSkeleton />
                                            <TotalCardSkeleton />
                                            <TotalCardSkeleton />
                                        </>
                                    ) : numericColumns.length > 0 ? (
                                        numericColumns.map((col) => (
                                            <TotalCard
                                                key={col}
                                                title={columnNameFormatter(col)}
                                                value={aggregateField(
                                                    rows,
                                                    col,
                                                )}
                                                unit={unitForField(col)}
                                            />
                                        ))
                                    ) : (
                                        <Card>
                                            <CardContent className="text-muted-foreground py-6 text-center text-sm">
                                                No data available
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {showTable && activeTable && (
                <TableBox
                    title={activeTable}
                    data={data?.[activeTable] ?? []}
                    timeRange={timeRange}
                    isLoading={isRefreshing}
                    showTitle={show === "table"}
                />
            )}
        </div>
    );
}
