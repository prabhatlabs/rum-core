import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-32">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option} value={option}>
                        {OPTION_LABELS[option] ?? option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
