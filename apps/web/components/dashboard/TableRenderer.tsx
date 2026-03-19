import { tableNames } from "@/components/dashboard/pages";
import { RefreshButton } from "@/components/dashboard/RefreshButton";
import { TableBox } from "@/components/dashboard/TableBox";
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { TimeRange } from "@rum-core/shared";

interface TableRendererProps {
    tableNames: string[];
    data?: Record<string, unknown[]>;
    timeRange: TimeRange;
    onTimeRangeChange: (value: TimeRange) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    selectedTable: string | null;
    onTableSelect: (table: string | null) => void;
}

export function TableRenderer({
    tableNames: tables,
    data,
    timeRange,
    onTimeRangeChange,
    onRefresh,
    isRefreshing,
    selectedTable,
    onTableSelect,
}: TableRendererProps) {
    const activeTable =
        selectedTable && tables.includes(selectedTable)
            ? selectedTable
            : (tables[0] ?? null);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
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
                <TimeRangeSelector
                    value={timeRange}
                    onChange={onTimeRangeChange}
                />
                <RefreshButton
                    onRefresh={onRefresh}
                    isRefreshing={isRefreshing}
                />
            </div>
            {activeTable && (
                <TableBox
                    title={activeTable}
                    data={data?.[activeTable] ?? []}
                    timeRange={timeRange}
                />
            )}
        </div>
    );
}
