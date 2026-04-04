import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFieldStatus, getFieldThreshold } from "@/lib/field-config";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TotalCardProps {
    fieldName?: string;
    title: string;
    value: number | null;
    unit?: string;
    isLoading?: boolean;
    className?: string;
}

export function TotalCard({
    fieldName,
    title,
    value,
    unit,
    isLoading,
    className,
}: TotalCardProps) {
    if (isLoading) {
        return <TotalCardSkeleton />;
    }

    const thresholds = getFieldThreshold(fieldName);
    const status =
        fieldName && value !== null
            ? getFieldStatus(fieldName, value)
            : undefined;
    const statusClassName =
        status === "good"
            ? "text-success"
            : status === "poor"
              ? "text-destructive"
              : status === "warning"
                ? "text-warning"
                : "";

    return (
        <Card className={cn(className)}>
            <CardHeader className="flex items-center justify-between gap-2">
                <CardTitle className="capitalize">{title}</CardTitle>
                {thresholds && (
                    <ThresholdDropDown
                        good={thresholds?.good}
                        poor={thresholds?.poor}
                        unit={unit}
                        higherIsBetter={!!thresholds.higherIsBetter}
                    />
                )}
            </CardHeader>
            <CardContent>
                <span className={`${statusClassName} text-2xl font-semibold`}>
                    {value !== null
                        ? `${value.toFixed(2)}${unit ? ` ${unit}` : ""}`
                        : "-"}
                </span>
            </CardContent>
        </Card>
    );
}

export function ThresholdDropDown({
    good,
    poor,
    higherIsBetter,
    unit,
}: {
    good: number;
    poor: number;
    higherIsBetter: boolean;
    unit?: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={"icon-xs"} className="">
                    <Info />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36" align="end" forceMount>
                <div className="text-muted-foreground text-xs p-2">
                    <p>
                        {higherIsBetter
                            ? "Higher is better."
                            : "Lower is better."}
                    </p>
                    <p>
                        Good:{" "}
                        <span className="text-foreground">
                            {good} {unit && `(${unit})`}
                        </span>
                    </p>
                    <p>
                        Poor:{" "}
                        <span className="text-foreground">
                            {poor} {unit && `(${unit})`}
                        </span>
                    </p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
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
