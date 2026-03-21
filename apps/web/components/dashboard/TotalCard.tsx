import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function aggregateField(rows: unknown[], field: string): number | null {
    if (rows.length === 0) return null;
    const sum = rows.reduce<number>((acc, row) => {
        const val = (row as Record<string, unknown>)[field];
        return acc + (typeof val === "number" ? val : Number(val) || 0);
    }, 0);

    // avg or sum
    return field.endsWith("_ms") || field.startsWith("avg_")
        ? Math.round(sum / rows.length)
        : sum;
}

export function unitForField(field: string): string | undefined {
    if (field.endsWith("_ms")) return "ms";
    if (field.endsWith("_pct")) return "%";
    return undefined;
}

interface TotalCardProps {
    title: string;
    value: number | null;
    unit?: string;
    isLoading?: boolean;
    className?: string;
}

export function TotalCard({ title, value, unit, isLoading, className }: TotalCardProps) {
    if (isLoading) {
        return <TotalCardSkeleton />;
    }

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle className="capitalize">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <span className="text-2xl font-semibold">
                    {value !== null
                        ? `${value.toLocaleString()}${unit ? ` ${unit}` : ""}`
                        : "-"}
                </span>
            </CardContent>
        </Card>
    );
}

export function TotalCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-24 rounded" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-32 rounded" />
            </CardContent>
        </Card>
    );
}
