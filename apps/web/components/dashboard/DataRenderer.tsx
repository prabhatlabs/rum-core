import { MapWithMarkerRenderer } from "@/components/dashboard/MapWithMarkerRenderer";
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

    const activeLabel = activeTable
        ? (tableNames[activeTable] ?? activeTable)
        : null;

    const rows = activeTable ? ((data?.[activeTable] ?? []) as unknown[]) : [];
    const columns = rows[0]
        ? Object.keys(rows[0] as Record<string, unknown>)
        : [];
    const countryCol = columns.find(
        (col) => col === "country" || col === "top_country",
    );
    const hasMap =
        showCards && !!countryCol && !isRefreshing && rows.length > 0;

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2">
                {/* titles */}
                <div>
                    <h1 className="text-2xl font-bold">{title || ""}</h1>
                    {activeLabel && show !== "cards" && (
                        <p className="text-muted-foreground text-sm">
                            {activeLabel}
                        </p>
                    )}
                </div>

                {/* dropdown */}
                <div className="flex flex-wrap items-center justify-end gap-2">
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

            <div className="space-y-6">
                {showCards &&
                    (show === "cards"
                        ? tables
                        : activeTable
                          ? [activeTable]
                          : []
                    ).map((table) => {
                        const tableRows = (data?.[table] ?? []) as unknown[];
                        const tableColumns = tableRows[0]
                            ? Object.keys(
                                  tableRows[0] as Record<string, unknown>,
                              )
                            : [];
                        const numericCols = tableColumns.filter((col) => {
                            const val = (
                                tableRows[0] as Record<string, unknown>
                            )[col];
                            if (typeof val !== "number") return false;
                            return !isTimestamp(val);
                        });

                        return (
                            <div key={table}>
                                {show === "cards" && (
                                    <p className="text-muted-foreground text-sm mb-2">
                                        {tableNames[table] ?? table}
                                    </p>
                                )}
                                <div
                                    className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`}
                                >
                                    {isRefreshing ? (
                                        <>
                                            <TotalCardSkeleton />
                                            <TotalCardSkeleton />
                                            <TotalCardSkeleton />
                                        </>
                                    ) : numericCols.length > 0 ? (
                                        numericCols.map((col) => (
                                            <TotalCard
                                                key={col}
                                                title={columnNameFormatter(col)}
                                                value={aggregateField(
                                                    tableRows,
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

            {hasMap && countryCol && (
                <MapWithMarkerRenderer rows={rows} countryColumn={countryCol} />
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
