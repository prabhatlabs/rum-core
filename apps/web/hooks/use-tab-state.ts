"use client";

import { create } from "zustand";
import type { TimeRange } from "@rum-core/shared";
import type { TabType } from "@/components/dashboard/pages";

interface TabState {
    ranges: Partial<Record<TabType, TimeRange>>;
    selectedTables: Partial<Record<TabType, string | null>>;
    getTimeRange: (tab: TabType) => TimeRange;
    setTimeRange: (tab: TabType, range: TimeRange) => void;
    getSelectedTable: (tab: TabType) => string | null;
    setSelectedTable: (tab: TabType, table: string | null) => void;
}

export const useTabState = create<TabState>((set, get) => ({
    ranges: {},
    selectedTables: {},
    getTimeRange: (tab) => get().ranges[tab] ?? "24h",
    setTimeRange: (tab, range) =>
        set((state) => ({ ranges: { ...state.ranges, [tab]: range } })),
    getSelectedTable: (tab) => get().selectedTables[tab] ?? null,
    setSelectedTable: (tab, table) =>
        set((state) => ({
            selectedTables: { ...state.selectedTables, [tab]: table },
        })),
}));
