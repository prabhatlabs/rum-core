import { onCLS, onFCP, onINP, onLCP } from "web-vitals";

(function (global: any) {
    "use strict";

    if (typeof window === "undefined") return;

    const PROJECT_KEY = (document.currentScript as HTMLScriptElement | null)?.getAttribute("data-key") ?? null;
    let WORKER_URL: string | null = (document.currentScript as HTMLScriptElement | null)?.getAttribute("data-worker") ?? null;

    if (!PROJECT_KEY) {
        console.warn("[rum-core] Missing data-key attribute on script tag");
        return;
    }

    if (!WORKER_URL) {
        console.warn("[rum-core] Missing data-worker attribute on script tag");
        return;
    }

    const WORKER_URL_STR = WORKER_URL;

    const BATCH_INTERVAL_MS = 10_000;
    const SESSION_ID = `sess_${PROJECT_KEY}` + Math.random().toString(36).slice(2, 12);

    const queue: any[] = [];

    const vitals: { lcp: number | null; fcp: number | null; cls: number | null; inp: number | null } = {
        lcp: null,
        fcp: null,
        cls: null,
        inp: null,
    };

    function getEnvironment() {
        const ua = navigator.userAgent;

        let browser = "Unknown";
        let browser_version: string | null = null;
        if (/Edg\//.test(ua)) {
            browser = "Edge";
            browser_version = (ua.match(/Edg\/([\d.]+)/) || [])[1] || null;
        } else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) {
            browser = "Chrome";
            browser_version = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || null;
        } else if (/Firefox\//.test(ua)) {
            browser = "Firefox";
            browser_version = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || null;
        } else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
            browser = "Safari";
            browser_version = (ua.match(/Version\/([\d.]+)/) || [])[1] || null;
        }

        let os = "Unknown";
        let os_version: string | null = null;
        if (/Windows NT/.test(ua)) {
            os = "Windows";
            os_version = (ua.match(/Windows NT ([\d.]+)/) || [])[1] || null;
        } else if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) {
            os = "macOS";
            os_version = ((ua.match(/Mac OS X ([\d_]+)/) || [])[1] || "").replace(/_/g, ".") || null;
        } else if (/Android/.test(ua)) {
            os = "Android";
            os_version = (ua.match(/Android ([\d.]+)/) || [])[1] || null;
        } else if (/iPhone|iPad/.test(ua)) {
            os = "iOS";
            os_version = ((ua.match(/OS ([\d_]+)/) || [])[1] || "").replace(/_/g, ".") || null;
        } else if (/Linux/.test(ua)) {
            os = "Linux";
        }

        let device_type = "desktop";
        if (/Mobi|Android.*Mobile|iPhone/.test(ua)) {
            device_type = "mobile";
        } else if (/iPad|Android(?!.*Mobile)/.test(ua)) {
            device_type = "tablet";
        }

        let screen_res: string | null = null;
        if (screen.width && screen.height) {
            screen_res = `${screen.width}x${screen.height}`;
        }

        const connection: any = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        const connection_type = connection?.effectiveType ?? null;

        const language = navigator.language || null;

        return {
            browser,
            browser_version,
            os,
            os_version,
            device_type,
            screen_res,
            connection_type,
            language,
        };
    }

    const env = getEnvironment();

    function normalizeUrl(rawUrl: string) {
        try {
            const url = new URL(rawUrl, location.origin);
            const normalized = url.pathname
                .split("/")
                .map((seg: string) => (/^[0-9a-f-]{8,}$|^\d+$/.test(seg) && seg.length > 0 ? ":id" : seg))
                .join("/");
            return normalized || "/";
        } catch {
            return rawUrl;
        }
    }

    function extractTiming(entry: PerformanceResourceTiming | null) {
        if (!entry) {
            return { dns: null, tcp: null, tls: null, ttfb: null, duration: null };
        }

        let dns: number | null = null;
        if (entry.domainLookupEnd - entry.domainLookupStart > 0) {
            dns = entry.domainLookupEnd - entry.domainLookupStart;
        }

        let tcp: number | null = null;
        if (entry.connectEnd - entry.connectStart > 0) {
            tcp = entry.connectEnd - entry.connectStart;
        }

        let tls: number | null = null;
        if (entry.secureConnectionStart > 0) {
            tls = entry.connectEnd - entry.secureConnectionStart;
        }

        let ttfb: number | null = null;
        if (entry.responseStart - entry.requestStart > 0) {
            ttfb = entry.responseStart - entry.requestStart;
        }

        let duration: number | null = null;
        if (entry.duration > 0) {
            duration = entry.duration;
        }

        return { dns, tcp, tls, ttfb, duration };
    }

    function getResourceTiming(url: string) {
        try {
            const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
            if (!entries || entries.length === 0) {
                return null;
            }

            for (let i = entries.length - 1; i >= 0; i--) {
                const entry = entries[i];
                if (entry?.name === url || (entry?.name && entry.name.endsWith(url))) {
                    return entry;
                }
            }
        } catch {
            // ignored
        }
        return null;
    }

    function buildEvent(partial: any) {
        return {
            project_key: PROJECT_KEY,
            session_id: SESSION_ID,
            url: partial.url,
            method: partial.method,
            status_code: partial.status_code,
            request_size: partial.request_size,
            response_size: partial.response_size,
            dns: partial.dns,
            tcp: partial.tcp,
            tls: partial.tls,
            ttfb: partial.ttfb,
            duration: partial.duration,
            page_url: location.href,
            referrer: document.referrer || null,
            timestamp: Date.now(),
            ...env,
            lcp: vitals.lcp,
            fcp: vitals.fcp,
            cls: vitals.cls,
            inp: vitals.inp,
        };
    }

    function flush() {
        if (queue.length === 0) return;
        const batch = queue.splice(0, queue.length);
        const payload = JSON.stringify({ events: batch });

        if (!WORKER_URL) return;

        if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: "application/json" });
            navigator.sendBeacon(WORKER_URL_STR, blob);
        } else {
            fetch(WORKER_URL_STR, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
                keepalive: true,
            }).catch(() => { });
        }
    }

    setInterval(flush, BATCH_INTERVAL_MS);

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") flush();
    });

    // #region patch fetch
    const _fetch = global.fetch;
    global.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const reqUrl = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
        if (reqUrl === WORKER_URL_STR) return _fetch(input, init);

        const method = (init?.method ?? "GET").toUpperCase();
        const body = init?.body;
        let requestSize: number | null = null;

        if (body) {
            if (typeof body === "string") {
                requestSize = new Blob([body]).size;
            } else if (body instanceof Blob || body instanceof File) {
                requestSize = body.size;
            } else if (body instanceof ArrayBuffer) {
                requestSize = body.byteLength;
            } else if (body instanceof FormData) {
                try {
                    const tempReq = new Request("https://temp.com", { method: "POST", body });
                    requestSize = (await tempReq.clone().text()).length;
                } catch {
                    requestSize = null;
                }
            } else if (ArrayBuffer.isView(body)) {
                requestSize = body.byteLength;
            }
        }

        const start = performance.now();

        return _fetch(input, init).then((response: Response) => {
            const elapsed = performance.now() - start;
            const entry = getResourceTiming(reqUrl);
            const timing = extractTiming(entry);
            let responseSize: number | null = null;
            if (entry) {
                if (entry.encodedBodySize > 0) {
                    responseSize = entry.encodedBodySize;
                } else if (entry.transferSize > 0) {
                    responseSize = entry.transferSize;
                }
            }
            
            queue.push(buildEvent({
                url: normalizeUrl(reqUrl),
                method,
                status_code: response.status,
                request_size: requestSize,
                response_size: responseSize,
                dns: timing.dns,
                tcp: timing.tcp,
                tls: timing.tls,
                ttfb: timing.ttfb,
                duration: timing.duration || elapsed,
            }));

            return response;
        }).catch((err: Error) => {
            const elapsed = performance.now() - start;
            queue.push(buildEvent({
                url: normalizeUrl(reqUrl),
                method,
                status_code: null,
                request_size: requestSize,
                response_size: null,
                dns: null,
                tcp: null,
                tls: null,
                ttfb: null,
                duration: elapsed,
            }));
            throw err;
        });
    };

    // #region patch XMLHttpRequest
    const _XHR = global.XMLHttpRequest;
    function createXHRPatched(this: XMLHttpRequest) {
        const xhr = new _XHR();
        const self = this as any;

        let _method = "GET";
        let _url = "";
        let _requestSize: number | null = null;

        self.open = function (method: string, url: string, ...args: any[]) {
            _method = (method || "GET").toUpperCase();
            _url = url;
            return xhr.open.apply(xhr, [method, url, ...args]);
        };

        self.send = function (body?: any) {
            if (body) {
                try {
                    _requestSize = new Blob([body as BlobPart]).size;
                } catch {
                    _requestSize = null;
                }
            }

            if (_url === WORKER_URL_STR || (_url && _url.startsWith(WORKER_URL_STR))) {
                return xhr.send.apply(xhr, arguments);
            }

            xhr.addEventListener("load", () => {
                if (xhr.readyState !== 4) return;

                setTimeout(() => {
                    let fullUrl = _url;
                    try {
                        fullUrl = new URL(_url, location.origin).href;
                    } catch { }

                    let entry = getResourceTiming(fullUrl);
                    const timing = extractTiming(entry);
                    let responseSize: number | null = null;
                    if (entry) {
                        if (entry.encodedBodySize > 0) {
                            responseSize = entry.encodedBodySize;
                        } else if (entry.transferSize > 0) {
                            responseSize = entry.transferSize;
                        }
                    }

                    queue.push(buildEvent({
                        url: normalizeUrl(_url),
                        method: _method,
                        status_code: xhr.status || null,
                        request_size: _requestSize,
                        response_size: responseSize,
                        dns: timing.dns,
                        tcp: timing.tcp,
                        tls: timing.tls,
                        ttfb: timing.ttfb,
                        duration: timing.duration,
                    }));
                }, 0);
            });

            xhr.addEventListener("error", () => {
                queue.push(buildEvent({
                    url: normalizeUrl(_url),
                    method: _method,
                    status_code: null,
                    request_size: _requestSize,
                    response_size: null,
                    dns: null,
                    tcp: null,
                    tls: null,
                    ttfb: null,
                    duration: null,
                }));
            });

            xhr.addEventListener("timeout", () => {
                queue.push(buildEvent({
                    url: normalizeUrl(_url),
                    method: _method,
                    status_code: null,
                    request_size: _requestSize,
                    response_size: null,
                    dns: null,
                    tcp: null,
                    tls: null,
                    ttfb: null,
                    duration: null,
                }));
            });

            return xhr.send.apply(xhr, arguments);
        };

        self.setRequestHeader = function () {
            return xhr.setRequestHeader.apply(xhr, arguments);
        };

        self.getResponseHeader = function (header: string) {
            return xhr.getResponseHeader(header);
        };

        self.getAllResponseHeaders = function () {
            return xhr.getAllResponseHeaders();
        };

        self.abort = function () {
            return xhr.abort.apply(xhr, arguments);
        };

        self.overrideMimeType = function () {
            return xhr.overrideMimeType.apply(xhr, arguments);
        };

        self.addEventListener = function () {
            return xhr.addEventListener.apply(xhr, arguments);
        };

        self.removeEventListener = function () {
            return xhr.removeEventListener.apply(xhr, arguments);
        };

        self.dispatchEvent = function () {
            return xhr.dispatchEvent.apply(xhr, arguments);
        };

        Object.defineProperty(self, "readyState", {
            get: () => xhr.readyState,
        });

        Object.defineProperty(self, "status", {
            get: () => xhr.status,
        });

        Object.defineProperty(self, "statusText", {
            get: () => xhr.statusText,
        });

        Object.defineProperty(self, "responseText", {
            get: () => xhr.responseText,
        });

        Object.defineProperty(self, "response", {
            get: () => xhr.response,
        });

        Object.defineProperty(self, "responseURL", {
            get: () => xhr.responseURL,
        });

        return self;
    }

    const XHRPatched = function (this: XMLHttpRequest) {
        return createXHRPatched.call(this);
    } as any;

    XHRPatched.prototype = _XHR.prototype;
    XHRPatched.UNSENT = _XHR.UNSENT;
    XHRPatched.OPENED = _XHR.OPENED;
    XHRPatched.HEADERS_RECEIVED = _XHR.HEADERS_RECEIVED;
    XHRPatched.LOADING = _XHR.LOADING;
    XHRPatched.DONE = _XHR.DONE;

    global.XMLHttpRequest = XHRPatched;

    function initWebVitals() {
        try {
            onLCP((m) => { vitals.lcp = m.value; });
            onFCP((m) => { vitals.fcp = m.value; });
            onCLS((m) => { vitals.cls = m.value; });
            onINP((m) => { vitals.inp = m.value; });
        } catch { }
    }

    if (document.readyState === "complete") {
        initWebVitals();
    } else {
        window.addEventListener("load", initWebVitals);
    }

})(typeof window !== "undefined" ? window : global);
