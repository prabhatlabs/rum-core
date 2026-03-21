"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useDialog } from "@/hooks/use-dialog"
import type { TimeRange } from "@rum-core/shared"

interface TimeRangeSelectorProps {
    value: TimeRange
    onChange: (value: TimeRange) => void
    options?: TimeRange[]
}

const DEFAULT_OPTIONS: TimeRange[] = ['12h', '24h', '7d', '30d']

const OPTION_LABELS: Record<string, string> = {
    '12h': 'Last 12 hours',
    '24h': 'Last 24 hours',
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
}

export function TimeRangeSelector({ value, onChange, options = DEFAULT_OPTIONS }: TimeRangeSelectorProps) {
    const { user } = useAuth();
    const { openUpgrade } = useDialog();
    const allowedRanges = (user?.plan_limits.time_ranges ?? []) as readonly string[];

    function handleChange(selected: TimeRange) {
        if (!allowedRanges.includes(selected)) {
            openUpgrade(`The "${OPTION_LABELS[selected]}" time range is not available on your current plan.`);
            return;
        }
        onChange(selected);
    }

    return (
        <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="w-32">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem
                        key={option}
                        value={option}
                    >
                        {OPTION_LABELS[option] ?? option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
