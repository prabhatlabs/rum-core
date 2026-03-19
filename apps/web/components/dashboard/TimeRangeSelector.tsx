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

export function TimeRangeSelector({ value, onChange, options = DEFAULT_OPTIONS }: TimeRangeSelectorProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-25">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
