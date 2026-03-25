import type { Context } from "hono";

export function getGeo(c: Context) {
    const cf = (c.req.raw as any).cf;
    return {
        country: cf?.country ?? null,
        city: cf?.city ?? null,
        region: cf?.region ?? null,
        timezone: cf?.timezone ?? null,
        isp: cf?.asOrganization ?? null,
        asn: cf?.asn ?? null,
    };
}

export async function hashIp(c: Context): Promise<string | null> {
    const ip =
        c.req.header("cf-connecting-ip") ??
        c.req.header("x-forwarded-for") ??
        null;
    if (!ip) return null;
    const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(ip),
    );
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
