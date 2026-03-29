export type FieldStatus = "good" | "warning" | "poor" | "neutral";

export interface FieldConfig {
    label: string;
    unit?: string;
    threshold?: {
        good: number;
        poor: number;
        higherIsBetter?: boolean;
    };
}

export const fieldConfig: Record<string, FieldConfig> = {
    // Request counts
    total_requests: {
        label: "Total Requests",
    },
    error_count: {
        label: "Errors",
    },
    session_count: {
        label: "Sessions",
    },

    // Error rate (derived — error_count / total_requests)
    error_rate: {
        label: "Error Rate",
        unit: "%",
        threshold: { good: 0.01, poor: 0.05 },
    },

    // Request event timings
    avg_ttfb_ms: {
        label: "Avg TTFB",
        unit: "MS",
        threshold: { good: 200, poor: 800 },
    },
    avg_duration_ms: {
        label: "Avg Duration",
        unit: "MS",
        threshold: { good: 500, poor: 2000 },
    },
    avg_dns_ms: {
        label: "Avg DNS",
        unit: "MS",
        threshold: { good: 20, poor: 100 },
    },
    avg_tcp_ms: {
        label: "Avg TCP",
        unit: "MS",
        threshold: { good: 50, poor: 200 },
    },
    avg_tls_ms: {
        label: "Avg TLS",
        unit: "MS",
        threshold: { good: 50, poor: 200 },
    },

    // Web vitals
    avg_lcp_ms: {
        label: "Avg LCP",
        unit: "MS",
        threshold: { good: 2500, poor: 4000 },
    },
    avg_fcp_ms: {
        label: "Avg FCP",
        unit: "MS",
        threshold: { good: 1800, poor: 3000 },
    },
    avg_cls_score: {
        label: "Avg CLS",
        threshold: { good: 0.1, poor: 0.25 },
    },
    avg_inp_ms: {
        label: "Avg INP",
        unit: "MS",
        threshold: { good: 200, poor: 500 },
    },
    avg_vitals_score: {
        label: "Vitals Score",
        threshold: { good: 75, poor: 50, higherIsBetter: true },
    },

    // Device split
    device_mobile_pct: {
        label: "Mobile",
        unit: "%",
    },
};

export function formatFieldLabel(field: string): string {
    const name = fieldConfig[field]?.label;
    const unit = fieldConfig[field]?.unit;
    if (name && unit) {
        return `${name} (${unit})`;
    } else if (name) {
        return name;
    }
    return field.replace("_pct", " (%)").replaceAll("_", " ");
}

export function getFieldStatus(field: string, value: number): FieldStatus {
    const t = fieldConfig[field]?.threshold;
    if (!t) return "neutral";
    if (t.higherIsBetter) {
        if (value >= t.good) return "good";
        if (value <= t.poor) return "poor";
        return "warning";
    }
    if (value <= t.good) return "good";
    if (value >= t.poor) return "poor";
    return "warning";
}

export function aggregateField(rows: unknown[], field: string): number | null {
    if (rows.length === 0) return null;
    const sum = rows.reduce<number>((acc, row) => {
        const val = (row as Record<string, unknown>)[field];
        return acc + (typeof val === "number" ? val : Number(val) || 0);
    }, 0);

    // avg or sum
    return field.endsWith("_ms") ||
        field.startsWith("avg_") ||
        field.endsWith("_pct")
        ? sum / rows.length
        : sum;
}

export function unitForField(field: string): string | undefined {
    return fieldConfig[field]?.unit;
}
