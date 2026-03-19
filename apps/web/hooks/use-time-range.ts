"use client"

import { create } from "zustand"
import type { TimeRange } from "@rum-core/shared"
import type { TabType } from "@/components/dashboard/pages"

interface TimeRangeState {
    ranges: Partial<Record<TabType, TimeRange>>
    getTimeRange: (tab: TabType) => TimeRange
    setTimeRange: (tab: TabType, range: TimeRange) => void
}

export const useTimeRange = create<TimeRangeState>((set, get) => ({
    ranges: {},
    getTimeRange: (tab) => get().ranges[tab] ?? "24h",
    setTimeRange: (tab, range) =>
        set((state) => ({ ranges: { ...state.ranges, [tab]: range } })),
}))
