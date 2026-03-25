"use client";

import { TableBox } from "@/components/dashboard/TableBox";
import { TotalCard } from "@/components/dashboard/TotalCard";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserUsage, type UsageTimeRange } from "@/hooks/api/use-usage";
import { useAuth } from "@/hooks/use-auth";
import { Zap } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const RANGE_OPTIONS: { value: UsageTimeRange; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
];

const chartConfig = {
    calls_used: {
        label: "Calls",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

export function UsagePage() {
    const [range, setRange] = useState<UsageTimeRange>("7d");
    const { data, totalCalls, isLoading } = useUserUsage(range);

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Usage</h1>
                    <p className="text-muted-foreground text-sm">
                        *Across Projects
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <PlanLimitsDropdown />
                    <Select
                        value={range}
                        onValueChange={(v) => setRange(v as UsageTimeRange)}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {RANGE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <TotalCard
                title="Total Calls"
                value={isLoading ? null : totalCalls}
                isLoading={isLoading}
                className="max-w-xs"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Calls</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <LoadingSpinner />
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                            No data available
                        </div>
                    ) : (
                        <ChartContainer
                            config={chartConfig}
                            className="h-64 w-full"
                        >
                            <BarChart data={data}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => {
                                        const d = new Date(value);
                                        return d.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(value) => {
                                                const d = new Date(
                                                    value as string,
                                                );
                                                return d.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric",
                                                    },
                                                );
                                            }}
                                        />
                                    }
                                />
                                <Bar
                                    dataKey="calls_used"
                                    fill="var(--color-calls_used)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>

            <TableBox
                title="Daily Breakdown"
                data={data}
                isLoading={isLoading}
                showTitle={true}
            />
        </div>
    );
}

function PlanLimitsDropdown() {
    const { user } = useAuth();
    const limits = user?.plan_limits;
    const plan = user?.plan;

    if (!limits) return null;

    const rows = [
        { label: "Plan", value: plan?.type?.toUpperCase() ?? "FREE" },
        { label: "Max Projects", value: String(limits.projects) },
        {
            label: "Daily Calls Limit",
            value: limits.calls_per_day.toLocaleString(),
        },
        { label: "Data Retention", value: `${limits.retention_days} days` },
        { label: "Time Ranges", value: limits.time_ranges.join(", ") },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Zap className="size-4" />
                    <span className="hidden sm:inline">Limits</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <div className="p-3 space-y-3">
                    <p className="text-sm font-medium leading-none">
                        Plan Limits
                    </p>
                    <div className="space-y-2">
                        {rows.map((row) => (
                            <div
                                key={row.label}
                                className="flex justify-between text-xs"
                            >
                                <span className="text-muted-foreground">
                                    {row.label}
                                </span>
                                <span className="font-medium">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
