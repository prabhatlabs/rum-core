import { Card, CardContent } from "@/components/ui/card";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";
import * as React from "react";

interface MapWithMarkerRendererProps {
    rows: unknown[];
    countryColumn: string;
}

interface CountryMarker extends Marker {
    code: string;
    totalRequests: number;
}

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
    US: { lat: 39.8, lng: -98.5 },
    CA: { lat: 56.1, lng: -106.3 },
    MX: { lat: 23.6, lng: -102.5 },
    BR: { lat: -14.2, lng: -51.9 },
    AR: { lat: -38.4, lng: -63.6 },
    CO: { lat: 4.5, lng: -74.2 },
    CL: { lat: -35.6, lng: -71.5 },
    PE: { lat: -9.1, lng: -75.0 },
    VE: { lat: 6.4, lng: -66.5 },
    EC: { lat: -1.8, lng: -78.1 },
    UY: { lat: -32.5, lng: -55.7 },
    PY: { lat: -23.4, lng: -58.4 },
    BO: { lat: -16.2, lng: -63.5 },
    GB: { lat: 55.3, lng: -3.4 },
    DE: { lat: 51.1, lng: 10.4 },
    FR: { lat: 46.2, lng: 2.2 },
    IT: { lat: 41.8, lng: 12.5 },
    ES: { lat: 40.4, lng: -3.7 },
    PT: { lat: 39.3, lng: -8.2 },
    NL: { lat: 52.1, lng: 5.2 },
    BE: { lat: 50.5, lng: 4.4 },
    SE: { lat: 60.1, lng: 18.6 },
    NO: { lat: 60.4, lng: 8.4 },
    DK: { lat: 56.2, lng: 9.5 },
    FI: { lat: 61.9, lng: 25.7 },
    PL: { lat: 51.9, lng: 19.1 },
    CZ: { lat: 49.8, lng: 15.4 },
    AT: { lat: 47.5, lng: 14.5 },
    CH: { lat: 46.8, lng: 8.2 },
    IE: { lat: 53.4, lng: -8.2 },
    RO: { lat: 45.9, lng: 24.9 },
    HU: { lat: 47.1, lng: 19.5 },
    GR: { lat: 39.0, lng: 21.8 },
    BG: { lat: 42.7, lng: 25.4 },
    HR: { lat: 45.1, lng: 15.2 },
    SK: { lat: 48.6, lng: 19.7 },
    SI: { lat: 46.1, lng: 14.9 },
    LT: { lat: 55.1, lng: 23.8 },
    LV: { lat: 56.8, lng: 24.6 },
    EE: { lat: 58.5, lng: 25.0 },
    RU: { lat: 61.5, lng: 105.3 },
    UA: { lat: 48.3, lng: 31.1 },
    BY: { lat: 53.7, lng: 27.9 },
    CN: { lat: 35.8, lng: 104.1 },
    JP: { lat: 36.2, lng: 138.2 },
    KR: { lat: 35.9, lng: 127.7 },
    IN: { lat: 20.5, lng: 78.9 },
    ID: { lat: -0.7, lng: 113.9 },
    TH: { lat: 15.8, lng: 100.9 },
    VN: { lat: 14.0, lng: 108.2 },
    PH: { lat: 12.8, lng: 121.7 },
    MY: { lat: 4.2, lng: 101.9 },
    SG: { lat: 1.3, lng: 103.8 },
    TW: { lat: 23.6, lng: 120.9 },
    HK: { lat: 22.3, lng: 114.1 },
    KH: { lat: 12.5, lng: 104.9 },
    MM: { lat: 21.9, lng: 95.9 },
    LA: { lat: 19.8, lng: 102.4 },
    NP: { lat: 28.3, lng: 84.1 },
    BD: { lat: 23.6, lng: 90.3 },
    LK: { lat: 7.8, lng: 80.7 },
    PK: { lat: 30.3, lng: 69.3 },
    AU: { lat: -25.2, lng: 133.7 },
    NZ: { lat: -40.9, lng: 174.8 },
    ZA: { lat: -30.5, lng: 22.9 },
    NG: { lat: 9.0, lng: 8.6 },
    KE: { lat: -0.02, lng: 37.9 },
    EG: { lat: 26.8, lng: 30.8 },
    MA: { lat: 31.7, lng: -7.0 },
    TN: { lat: 33.8, lng: 9.5 },
    DZ: { lat: 28.0, lng: 1.6 },
    GH: { lat: 7.9, lng: -1.0 },
    ET: { lat: 9.1, lng: 40.4 },
    TZ: { lat: -6.3, lng: 34.8 },
    UG: { lat: 1.3, lng: 32.2 },
    SN: { lat: 14.4, lng: -14.4 },
    CI: { lat: 7.5, lng: -5.5 },
    CM: { lat: 7.3, lng: 12.3 },
    SA: { lat: 23.8, lng: 45.0 },
    AE: { lat: 23.4, lng: 53.8 },
    IL: { lat: 31.0, lng: 34.8 },
    TR: { lat: 38.9, lng: 35.2 },
    IQ: { lat: 33.2, lng: 43.6 },
    IR: { lat: 32.4, lng: 53.6 },
    JO: { lat: 30.5, lng: 36.2 },
    LB: { lat: 33.8, lng: 35.8 },
    KW: { lat: 29.3, lng: 47.4 },
    QA: { lat: 25.3, lng: 51.1 },
    BH: { lat: 26.0, lng: 50.5 },
    OM: { lat: 21.4, lng: 55.9 },
    GE: { lat: 42.3, lng: 43.3 },
    AM: { lat: 40.0, lng: 45.0 },
    AZ: { lat: 40.1, lng: 47.5 },
    KZ: { lat: 48.0, lng: 68.0 },
    UZ: { lat: 41.3, lng: 64.5 },
};

function getMapMarkers(rows: unknown[], countryCol: string): CountryMarker[] {
    const countryTotals = new Map<string, number>();
    for (const row of rows) {
        const record = row as Record<string, unknown>;
        const code = String(record[countryCol] ?? "").toUpperCase();
        if (code && COUNTRY_COORDS[code]) {
            const total = Number(record["total_requests"] ?? record["session_count"] ?? 0) || 0;
            countryTotals.set(code, (countryTotals.get(code) ?? 0) + total);
        }
    }
    return Array.from(countryTotals.entries()).map(([code, totalRequests]) => {
        const coords = COUNTRY_COORDS[code]!;
        return {
            lat: coords.lat,
            lng: coords.lng,
            size: 8,
            code,
            totalRequests,
        };
    });
}

export function MapWithMarkerRenderer({
    rows,
    countryColumn,
}: MapWithMarkerRendererProps) {
    const markers = getMapMarkers(rows, countryColumn);
    const [hovered, setHovered] = React.useState<{ code: string; totalRequests: number } | null>(null);
    const [pos, setPos] = React.useState({ x: 0, y: 0 });

    return (
        <Card>
            <CardContent className="p-4 relative">
                <DottedMap<CountryMarker>
                    markers={markers}
                    height={150}
                    width={300}
                    dotRadius={0.5}
                    markerColor="color-mix(in srgb, var(--primary) 30%, transparent)"
                    renderMarkerOverlay={({ marker, x, y, r }) => (
                        <foreignObject
                            x={x - r}
                            y={y - r}
                            width={r * 2}
                            height={r * 2}
                            overflow="visible"
                        >
                            <div
                                className="flex items-center justify-center w-full h-full cursor-pointer"
                                onMouseEnter={(e) => {
                                    setHovered(marker);
                                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                                    const container = (e.target as HTMLElement).closest(".relative")!.getBoundingClientRect();
                                    setPos({
                                        x: rect.left - container.left + rect.width / 2,
                                        y: rect.top - container.top,
                                    });
                                }}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <img
                                    src={`https://flagcdn.com/w80/${marker.code.toLowerCase()}.webp`}
                                    alt={marker.code.toLowerCase()}
                                    className="rounded-full"
                                    style={{
                                        width: r * 1.8,
                                        height: r * 1.8,
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        </foreignObject>
                    )}
                />
                {hovered && (
                    <div
                        className="absolute z-50 -translate-x-1/2 -translate-y-full pointer-events-none"
                        style={{ left: pos.x, top: pos.y - 4 }}
                    >
                        <div className="flex items-center gap-1.5 bg-foreground text-background text-xs px-2 py-1 rounded-none whitespace-nowrap">
                            <span className="font-medium">{hovered.code}:</span>
                            <span>{hovered.totalRequests.toLocaleString()} requests</span>
                        </div>
                        <div className="w-2 h-2 bg-foreground rotate-45 mx-auto -mt-1" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
