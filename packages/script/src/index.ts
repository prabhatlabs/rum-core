import { onCLS, onFCP, onINP, onLCP } from "web-vitals";

(function (global: any) {
    "use strict";

    try {
        if (typeof window === "undefined") return;

        const PROJECT_KEY = (document.currentScript as HTMLScriptElement | null)?.getAttribute("data-key") ?? null;
        const WORKER_URL = (document.currentScript as HTMLScriptElement | null)?.getAttribute("data-worker") ?? null;

        if (!PROJECT_KEY) { console.warn("[rum-core] Missing data-key attribute on script tag"); return; }
        if (!WORKER_URL) { console.warn("[rum-core] Missing data-worker attribute on script tag"); return; }

        const EVENTS_URL = `${WORKER_URL}/ingest/events`;
        const VITALS_URL = `${WORKER_URL}/ingest/vitals`;
        const BATCH_INTERVAL_MS = 10_000;
        const SESSION_ID = `sess_${PROJECT_KEY}_${Math.random().toString(36).slice(2, 12)}`;

        // ─── Environment (captured once on load) ──────────────────────────────────

        function getEnvironment() {
            const ua = navigator.userAgent;

            let browser = "Unknown", browser_version: string | null = null;
            if (/Edg\//.test(ua)) { browser = "Edge"; browser_version = (ua.match(/Edg\/([\d.]+)/) || [])[1] || null; }
            else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) { browser = "Chrome"; browser_version = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || null; }
            else if (/Firefox\//.test(ua)) { browser = "Firefox"; browser_version = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || null; }
            else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) { browser = "Safari"; browser_version = (ua.match(/Version\/([\d.]+)/) || [])[1] || null; }

            let os = "Unknown", os_version: string | null = null;
            if (/Windows NT/.test(ua)) { os = "Windows"; os_version = (ua.match(/Windows NT ([\d.]+)/) || [])[1] || null; }
            else if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) { os = "macOS"; os_version = ((ua.match(/Mac OS X ([\d_]+)/) || [])[1] || "").replace(/_/g, ".") || null; }
            else if (/Android/.test(ua)) { os = "Android"; os_version = (ua.match(/Android ([\d.]+)/) || [])[1] || null; }
            else if (/iPhone|iPad/.test(ua)) { os = "iOS"; os_version = ((ua.match(/OS ([\d_]+)/) || [])[1] || "").replace(/_/g, ".") || null; }
            else if (/Linux/.test(ua)) { os = "Linux"; }

            let device_type = "desktop";
            if (/Mobi|Android.*Mobile|iPhone/.test(ua)) device_type = "mobile";
            else if (/iPad|Android(?!.*Mobile)/.test(ua)) device_type = "tablet";

            const connection: any = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

            return {
                browser,
                browser_version,
                os,
                os_version,
                device_type,
                screen_res: screen.width && screen.height ? `${screen.width}x${screen.height}` : null,
                connection_type: connection?.effectiveType ?? null,
                language: navigator.language || null,
            };
        }

        const env = getEnvironment();

        // ─── Helpers ──────────────────────────────────────────────────────────────

        function normalizeUrl(rawUrl: string): string {
            try {
                const url = new URL(rawUrl, location.origin);
                const normalizedPath = url.pathname
                    .split("/")
                    .map((seg) => (/^[0-9a-f-]{8,}$|^\d+$/.test(seg) && seg.length > 0 ? ":id" : seg))
                    .join("/");
                return `${url.origin}${normalizedPath || "/"}`;
            } catch {
                return rawUrl;
            }
        }

        function extractTiming(entry: PerformanceResourceTiming | null) {
            if (!entry) return { dns: null, tcp: null, tls: null, ttfb: null, duration: null };
            return {
                dns: entry.domainLookupEnd - entry.domainLookupStart > 0 ? entry.domainLookupEnd - entry.domainLookupStart : null,
                tcp: entry.connectEnd - entry.connectStart > 0 ? entry.connectEnd - entry.connectStart : null,
                tls: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : null,
                ttfb: entry.responseStart - entry.requestStart > 0 ? entry.responseStart - entry.requestStart : null,
                duration: entry.duration > 0 ? entry.duration : null,
            };
        }

        function getResourceTiming(url: string): PerformanceResourceTiming | null {
            try {
                const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
                for (let i = entries.length - 1; i >= 0; i--) {
                    const e = entries[i];
                    if (e?.name === url || e?.name?.endsWith(url)) return e;
                }
            } catch { }
            return null;
        }

        function sendBeaconOrFetch(url: string, payload: string) {
            const blob = new Blob([payload], { type: "application/json" });
            if (navigator.sendBeacon) {
                navigator.sendBeacon(url, blob);
            } else {
                fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true, credentials: "omit" }).catch(() => { });
            }
        }

        // ─── Request Events ───────────────────────────────────────────────────────

        const eventQueue: any[] = [];

        function buildRequestEvent(partial: any) {
            return {
                project_key: PROJECT_KEY,
                session_id: SESSION_ID,
                url: partial.url,
                method: partial.method,
                status_code: partial.status_code ?? null,
                request_size: partial.request_size ?? null,
                response_size: partial.response_size ?? null,
                dns: partial.dns ?? null,
                tcp: partial.tcp ?? null,
                tls: partial.tls ?? null,
                ttfb: partial.ttfb ?? null,
                duration: partial.duration ?? null,
                page_url: location.href,
                referrer: document.referrer || null,
                timestamp: Date.now(),
                ...env,
            };
        }

        function flushEvents() {
            if (eventQueue.length === 0) return;
            const batch = eventQueue.splice(0, eventQueue.length);
            sendBeaconOrFetch(EVENTS_URL, JSON.stringify({ events: batch, project_key: PROJECT_KEY }));
        }

        setInterval(flushEvents, BATCH_INTERVAL_MS);
        document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushEvents(); });

        // ─── Web Vitals ───────────────────────────────────────────────────────────

        function computeVitalsScore(lcp: number | null, fcp: number | null, cls: number | null, inp: number | null): number | null {
            type Rating = "good" | "ni" | "poor";
            const ratingScore: Record<Rating, number> = { good: 100, ni: 50, poor: 0 };
            function rate(v: number, good: number, ni: number): Rating { return v <= good ? "good" : v <= ni ? "ni" : "poor"; }
            const scores: number[] = [];
            if (lcp !== null) scores.push(ratingScore[rate(lcp, 2500, 4000)]);
            if (fcp !== null) scores.push(ratingScore[rate(fcp, 1800, 3000)]);
            if (cls !== null) scores.push(ratingScore[rate(cls, 0.1, 0.25)]);
            if (inp !== null) scores.push(ratingScore[rate(inp, 200, 500)]);
            return scores.length === 0 ? null : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }

        function sendVitals(lcp: number | null, fcp: number | null, cls: number | null, inp: number | null) {
            sendBeaconOrFetch(VITALS_URL, JSON.stringify({
                project_key: PROJECT_KEY,
                session_id: SESSION_ID,
                page_url: location.href,
                referrer: document.referrer || null,
                timestamp: Date.now(),
                lcp,
                fcp,
                cls,
                inp,
                vitals_score: computeVitalsScore(lcp, fcp, cls, inp),
                ...env,
            }));
        }

        function initWebVitals() {
            try {
                const c = { lcp: null as number | null, fcp: null as number | null, cls: null as number | null, inp: null as number | null };
                let sent = false;

                function trySend() {
                    if (!sent && c.fcp !== null && c.lcp !== null) { sent = true; sendVitals(c.lcp, c.fcp, c.cls, c.inp); }
                }

                onLCP((m) => { c.lcp = m.value; trySend(); });
                onFCP((m) => { c.fcp = m.value; trySend(); });
                onCLS((m) => { c.cls = m.value; });
                onINP((m) => { c.inp = m.value; });

                // fallback — flush whatever collected if tab hidden before trySend fires
                document.addEventListener("visibilitychange", () => {
                    if (document.visibilityState === "hidden" && !sent) { sent = true; sendVitals(c.lcp, c.fcp, c.cls, c.inp); }
                });
            } catch { }
        }

        if (document.readyState === "complete") { initWebVitals(); }
        else { window.addEventListener("load", initWebVitals); }

        // ─── Patch fetch ──────────────────────────────────────────────────────────

        const _fetch = global.fetch;
        global.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
            const reqUrl = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
            if (reqUrl.startsWith(WORKER_URL!)) return _fetch(input, init);

            const method = (init?.method ?? "GET").toUpperCase();
            let requestSize: number | null = null;
            const body = init?.body;

            if (body) {
                if (typeof body === "string") requestSize = new Blob([body]).size;
                else if (body instanceof Blob || body instanceof File) requestSize = body.size;
                else if (body instanceof ArrayBuffer) requestSize = body.byteLength;
                else if (ArrayBuffer.isView(body)) requestSize = body.byteLength;
                else if (body instanceof FormData) {
                    try { requestSize = (await new Request("https://temp.com", { method: "POST", body }).clone().text()).length; }
                    catch { requestSize = null; }
                }
            }

            const start = performance.now();

            return _fetch(input, init).then((response: Response) => {
                const entry = getResourceTiming(reqUrl);
                const timing = extractTiming(entry);
                const responseSize = entry ? (entry.encodedBodySize > 0 ? entry.encodedBodySize : entry.transferSize > 0 ? entry.transferSize : null) : null;
                eventQueue.push(buildRequestEvent({ url: normalizeUrl(reqUrl), method, status_code: response.status, request_size: requestSize, response_size: responseSize, ...timing, duration: timing.duration ?? (performance.now() - start) }));
                return response;
            }).catch((err: Error) => {
                eventQueue.push(buildRequestEvent({ url: normalizeUrl(reqUrl), method, status_code: null, request_size: requestSize, response_size: null, dns: null, tcp: null, tls: null, ttfb: null, duration: performance.now() - start }));
                throw err;
            });
        };

        // ─── Patch XHR ────────────────────────────────────────────────────────────

        const _XHR = global.XMLHttpRequest;

        function createXHRPatched(this: XMLHttpRequest) {
            const xhr = new _XHR();
            const self = this as any;
            let _method = "GET", _url = "", _requestSize: number | null = null;

            self.open = function (method: string, url: string, ...args: any[]) {
                _method = (method || "GET").toUpperCase();
                _url = url;
                return xhr.open.apply(xhr, [method, url, ...args]);
            };

            self.send = function (body?: any) {
                if (body) { try { _requestSize = new Blob([body as BlobPart]).size; } catch { _requestSize = null; } }

                if (_url.startsWith(WORKER_URL!)) return xhr.send.apply(xhr, arguments);

                xhr.addEventListener("load", () => {
                    if (xhr.readyState !== 4) return;
                    setTimeout(() => {
                        let fullUrl = _url;
                        try { fullUrl = new URL(_url, location.origin).href; } catch { }
                        const entry = getResourceTiming(fullUrl);
                        const timing = extractTiming(entry);
                        const responseSize = entry ? (entry.encodedBodySize > 0 ? entry.encodedBodySize : entry.transferSize > 0 ? entry.transferSize : null) : null;
                        eventQueue.push(buildRequestEvent({ url: normalizeUrl(_url), method: _method, status_code: xhr.status || null, request_size: _requestSize, response_size: responseSize, ...timing }));
                    }, 0);
                });

                xhr.addEventListener("error", () => { eventQueue.push(buildRequestEvent({ url: normalizeUrl(_url), method: _method, status_code: null, request_size: _requestSize, response_size: null, dns: null, tcp: null, tls: null, ttfb: null, duration: null })); });
                xhr.addEventListener("timeout", () => { eventQueue.push(buildRequestEvent({ url: normalizeUrl(_url), method: _method, status_code: null, request_size: _requestSize, response_size: null, dns: null, tcp: null, tls: null, ttfb: null, duration: null })); });

                return xhr.send.apply(xhr, arguments);
            };

            self.abort = function () { return xhr.abort.apply(xhr, arguments); };
            self.setRequestHeader = function () { return xhr.setRequestHeader.apply(xhr, arguments); };
            self.getResponseHeader = function (h: string) { return xhr.getResponseHeader(h); };
            self.getAllResponseHeaders = function () { return xhr.getAllResponseHeaders(); };
            self.overrideMimeType = function () { return xhr.overrideMimeType.apply(xhr, arguments); };
            self.addEventListener = function () { return xhr.addEventListener.apply(xhr, arguments); };
            self.removeEventListener = function () { return xhr.removeEventListener.apply(xhr, arguments); };
            self.dispatchEvent = function () { return xhr.dispatchEvent.apply(xhr, arguments); };

            // read-only
            for (const prop of ["readyState", "status", "statusText", "response", "responseText", "responseXML", "responseURL", "upload"] as const) {
                Object.defineProperty(self, prop, { get: () => xhr[prop] });
            }

            // read-write
            for (const prop of ["responseType", "timeout", "withCredentials"] as const) {
                Object.defineProperty(self, prop, { get: () => xhr[prop], set: (val) => { (xhr as any)[prop] = val; } });
            }

            // event handlers
            for (const prop of ["onreadystatechange", "onload", "onerror", "ontimeout", "onabort", "onprogress", "onloadstart", "onloadend"] as const) {
                Object.defineProperty(self, prop, { get: () => xhr[prop], set: (val) => { (xhr as any)[prop] = val; } });
            }

            return self;
        }

        const XHRPatched = function (this: XMLHttpRequest) { return createXHRPatched.call(this); } as any;
        XHRPatched.prototype = _XHR.prototype;
        XHRPatched.UNSENT = _XHR.UNSENT;
        XHRPatched.OPENED = _XHR.OPENED;
        XHRPatched.HEADERS_RECEIVED = _XHR.HEADERS_RECEIVED;
        XHRPatched.LOADING = _XHR.LOADING;
        XHRPatched.DONE = _XHR.DONE;
        global.XMLHttpRequest = XHRPatched;

        console.log("[rum-core] Initialized");

    } catch (err) {
        console.error("[rum-core]", err);
    }
})(typeof window !== "undefined" ? window : global);