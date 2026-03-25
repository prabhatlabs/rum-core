import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export type UsageTimeRange = "today" | "7d" | "30d" | "60d";

export interface UsageByDate {
    date: string;
    calls_used: number;
}

export function useUserUsage(range: UsageTimeRange = "7d") {
    const { data, isLoading, error, mutate } = useSWR<UsageByDate[]>(
        `/usage?range=${range}`,
        () =>
            fetcher<UsageByDate[]>(`/usage?range=${range}`, {
                showToast: false,
            }),
    );

    const totalCalls = data?.reduce((sum, d) => sum + d.calls_used, 0) ?? 0;

    return {
        data: data ?? [],
        totalCalls,
        isLoading,
        error,
        mutate,
    };
}
