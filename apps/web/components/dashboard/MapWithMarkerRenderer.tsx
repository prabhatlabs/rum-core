"use client";

import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from "react-simple-maps";

interface MapWithMarkerRendererProps {
    rows: unknown[];
    countryColumn: string;
}

interface CountryData {
    code: string;
    totalRequests: number;
}

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ISO_NUM_TO_ALPHA2: Record<string, string> = {
    "004": "AF", "008": "AL", "012": "DZ", "020": "AD", "024": "AO",
    "032": "AR", "036": "AU", "040": "AT", "050": "BD", "056": "BE",
    "068": "BO", "070": "BA", "076": "BR", "100": "BG", "104": "MM",
    "108": "BI", "116": "KH", "120": "CM", "124": "CA", "140": "CF",
    "144": "LK", "148": "TD", "152": "CL", "156": "CN", "158": "TW",
    "170": "CO", "178": "CG", "180": "CD", "188": "CR", "191": "HR",
    "192": "CU", "196": "CY", "203": "CZ", "208": "DK", "214": "DO",
    "218": "EC", "222": "SV", "226": "GQ", "231": "ET", "232": "ER",
    "233": "EE", "246": "FI", "250": "FR", "266": "GA", "268": "GE",
    "270": "GM", "276": "DE", "288": "GH", "300": "GR", "320": "GT",
    "324": "GN", "328": "GY", "332": "HT", "340": "HN", "344": "HK",
    "348": "HU", "352": "IS", "356": "IN", "360": "ID", "364": "IR",
    "368": "IQ", "372": "IE", "376": "IL", "380": "IT", "388": "JM",
    "392": "JP", "398": "KZ", "400": "JO", "404": "KE", "408": "KP",
    "410": "KR", "414": "KW", "417": "KG", "418": "LA", "422": "LB",
    "426": "LS", "428": "LV", "430": "LR", "434": "LY", "438": "LI",
    "440": "LT", "442": "LU", "450": "MG", "454": "MW", "458": "MY",
    "466": "ML", "478": "MR", "484": "MX", "496": "MN", "498": "MD",
    "499": "ME", "504": "MA", "508": "MZ", "512": "OM", "516": "NA",
    "524": "NP", "528": "NL", "540": "NC", "554": "NZ", "558": "NI",
    "562": "NE", "566": "NG", "578": "NO", "586": "PK", "591": "PA",
    "598": "PG", "600": "PY", "604": "PE", "608": "PH", "616": "PL",
    "620": "PT", "630": "PR", "634": "QA", "642": "RO", "643": "RU",
    "646": "RW", "682": "SA", "686": "SN", "688": "RS", "694": "SL",
    "702": "SG", "703": "SK", "704": "VN", "705": "SI", "706": "SO",
    "710": "ZA", "716": "ZW", "724": "ES", "729": "SD", "740": "SR",
    "752": "SE", "756": "CH", "760": "SY", "762": "TJ", "764": "TH",
    "768": "TG", "780": "TT", "784": "AE", "788": "TN", "792": "TR",
    "795": "TM", "800": "UG", "804": "UA", "818": "EG", "826": "GB",
    "840": "US", "858": "UY", "860": "UZ", "862": "VE", "887": "YE",
    "894": "ZM",
};

const COUNTRY_COORDS: Record<string, [number, number]> = {
    US: [-98.5, 39.8], CA: [-106.3, 56.1], MX: [-102.5, 23.6],
    BR: [-51.9, -14.2], AR: [-63.6, -38.4], CO: [-74.2, 4.5],
    CL: [-71.5, -35.6], PE: [-75.0, -9.1], VE: [-66.5, 6.4],
    EC: [-78.1, -1.8], UY: [-55.7, -32.5], PY: [-58.4, -23.4],
    BO: [-63.5, -16.2], GB: [-3.4, 55.3], DE: [10.4, 51.1],
    FR: [2.2, 46.2], IT: [12.5, 41.8], ES: [-3.7, 40.4],
    PT: [-8.2, 39.3], NL: [5.2, 52.1], BE: [4.4, 50.5],
    SE: [18.6, 60.1], NO: [8.4, 60.4], DK: [9.5, 56.2],
    FI: [25.7, 61.9], PL: [19.1, 51.9], CZ: [15.4, 49.8],
    AT: [14.5, 47.5], CH: [8.2, 46.8], IE: [-8.2, 53.4],
    RO: [24.9, 45.9], HU: [19.5, 47.1], GR: [21.8, 39.0],
    BG: [25.4, 42.7], HR: [15.2, 45.1], SK: [19.7, 48.6],
    SI: [14.9, 46.1], LT: [23.8, 55.1], LV: [24.6, 56.8],
    EE: [25.0, 58.5], RU: [105.3, 61.5], UA: [31.1, 48.3],
    BY: [27.9, 53.7], CN: [104.1, 35.8], JP: [138.2, 36.2],
    KR: [127.7, 35.9], IN: [78.9, 20.5], ID: [113.9, -0.7],
    TH: [100.9, 15.8], VN: [108.2, 14.0], PH: [121.7, 12.8],
    MY: [101.9, 4.2], SG: [103.8, 1.3], TW: [120.9, 23.6],
    HK: [114.1, 22.3], KH: [104.9, 12.5], MM: [95.9, 21.9],
    LA: [102.4, 19.8], NP: [84.1, 28.3], BD: [90.3, 23.6],
    LK: [80.7, 7.8], PK: [69.3, 30.3], AU: [133.7, -25.2],
    NZ: [174.8, -40.9], ZA: [22.9, -30.5], NG: [8.6, 9.0],
    KE: [37.9, -0.02], EG: [30.8, 26.8], MA: [-7.0, 31.7],
    TN: [9.5, 33.8], DZ: [1.6, 28.0], GH: [-1.0, 7.9],
    ET: [40.4, 9.1], TZ: [34.8, -6.3], UG: [32.2, 1.3],
    SN: [-14.4, 14.4], CI: [-5.5, 7.5], CM: [12.3, 7.3],
    SA: [45.0, 23.8], AE: [53.8, 23.4], IL: [34.8, 31.0],
    TR: [35.2, 38.9], IQ: [43.6, 33.2], IR: [53.6, 32.4],
    JO: [36.2, 30.5], LB: [35.8, 33.8], KW: [47.4, 29.3],
    QA: [51.1, 25.3], BH: [50.5, 26.0], OM: [55.9, 21.4],
    GE: [43.3, 42.3], AM: [45.0, 40.0], AZ: [47.5, 40.1],
    KZ: [68.0, 48.0], UZ: [64.5, 41.3],
};

function getCountryData(rows: unknown[], countryCol: string): CountryData[] {
    const countryTotals = new Map<string, number>();
    for (const row of rows) {
        const record = row as Record<string, unknown>;
        const code = String(record[countryCol] ?? "").toUpperCase();
        if (code && COUNTRY_COORDS[code]) {
            const total = Number(record["total_requests"] ?? record["session_count"] ?? 0) || 0;
            countryTotals.set(code, (countryTotals.get(code) ?? 0) + total);
        }
    }
    return Array.from(countryTotals.entries()).map(([code, totalRequests]) => ({
        code,
        totalRequests,
    }));
}

export function MapWithMarkerRenderer({
    rows,
    countryColumn,
}: MapWithMarkerRendererProps) {
    const countryData = getCountryData(rows, countryColumn);
    const [tooltip, setTooltip] = React.useState<{
        code: string;
        totalRequests: number;
        x: number;
        y: number;
    } | null>(null);

    const maxRequests = React.useMemo(
        () => Math.max(...countryData.map((c) => c.totalRequests), 1),
        [countryData],
    );

    const countryOpacities = React.useMemo(() => {
        const map = new Map<string, number>();
        for (const item of countryData) {
            map.set(item.code, Math.round(10 + (item.totalRequests / maxRequests) * 70));
        }
        return map;
    }, [countryData, maxRequests]);

    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <Card className="max-h-60 lg:max-h-80 xl:max-h-100">
            <CardContent className="relative overflow-hidden" ref={containerRef}>
                <ComposableMap
                    projectionConfig={{ scale: 147 }}
                    style={{ width: "100%", height: "auto" }}
                >
                    <defs>
                        {countryData.map((item) => (
                            <clipPath key={item.code} id={`clip-${item.code}`}>
                                <circle r={6} cx={0} cy={0} />
                            </clipPath>
                        ))}
                    </defs>
                    <ZoomableGroup center={[0, 20]} zoom={1}>
                        <Geographies geography={TOPO_URL}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const alpha2 = ISO_NUM_TO_ALPHA2[geo.id] ?? "";
                                    const opacity = countryOpacities.get(alpha2);

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                                opacity
                                                    ? `color-mix(in srgb, var(--primary) ${opacity}%, transparent)`
                                                    : "transparent"
                                            }
                                            stroke="currentColor"
                                            strokeOpacity={0.2}
                                            strokeWidth={0.5}
                                            className="text-muted-foreground"
                                            style={{
                                                default: { outline: "none", transition: "fill 0.15s" },
                                                hover: {
                                                    outline: "none",
                                                    fill: opacity
                                                        ? `color-mix(in srgb, var(--primary) ${Math.min(opacity + 15, 90)}%, transparent)`
                                                        : "color-mix(in srgb, var(--muted) 30%, transparent)",
                                                    cursor: opacity ? "pointer" : "default",
                                                },
                                                pressed: { outline: "none" },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                        {countryData.map((item) => {
                            const coords = COUNTRY_COORDS[item.code];
                            if (!coords) return null;
                            return (
                                <Marker key={item.code} coordinates={coords}>
                                    <g
                                        className="cursor-pointer"
                                        onMouseEnter={(e) => {
                                            if (!containerRef.current) return;
                                            const markerEl = (e.target as SVGElement).closest("g")!;
                                            const markerRect = markerEl.getBoundingClientRect();
                                            const containerRect = containerRef.current!.getBoundingClientRect();
                                            setTooltip({
                                                code: item.code,
                                                totalRequests: item.totalRequests,
                                                x: markerRect.left - containerRect.left + markerRect.width / 2,
                                                y: markerRect.top - containerRect.top,
                                            });
                                        }}
                                        onMouseLeave={() => setTooltip(null)}
                                    >
                                        <circle
                                            r={6}
                                            fill="color-mix(in srgb, var(--primary) 15%, transparent)"
                                        />
                                        <image
                                            href={`https://flagcdn.com/w80/${item.code.toLowerCase()}.webp`}
                                            x={-6}
                                            y={-6}
                                            width={12}
                                            height={12}
                                            preserveAspectRatio="xMidYMid slice"
                                            clipPath={`url(#clip-${item.code})`}
                                        />
                                        <circle
                                            r={6}
                                            fill="none"
                                            stroke="color-mix(in srgb, var(--background) 50%, transparent)"
                                            strokeWidth={0.6}
                                        />
                                    </g>
                                </Marker>
                            );
                        })}
                    </ZoomableGroup>
                </ComposableMap>
                {tooltip && (
                    <div
                        className="absolute z-50 -translate-x-1/2 -translate-y-full pointer-events-none"
                        style={{ left: tooltip.x, top: tooltip.y - 8 }}
                    >
                        <div className="flex items-center gap-1.5 bg-foreground text-background text-xs px-2 py-1 whitespace-nowrap">
                            <span className="font-medium">{tooltip.code}:</span>
                            <span>{tooltip.totalRequests.toLocaleString()} requests</span>
                        </div>
                        <div className="w-2 h-2 bg-foreground rotate-45 mx-auto -mt-1" />
                    </div>
                )}
                <p className="absolute bottom-0 left-0 right-0 text-muted-foreground text-[10px] text-center">
                    *Drag to pan, scroll to zoom
                </p>
            </CardContent>
        </Card>
    );
}
