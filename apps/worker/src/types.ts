export interface IEventPayloadFromClient {
    project_key: string;
    session_id: string;
    url: string;
    method: string;
    status_code: number | null;
    request_size: number | null;
    response_size: number | null;
    dns: number | null;
    tcp: number | null;
    tls: number | null;
    ttfb: number | null;
    duration: number | null;
    page_url: string | null;
    referrer: string | null;
    timestamp: number | null;
    browser: string | null;
    browser_version: string | null;
    os: string | null;
    os_version: string | null;
    device_type: string | null;
    screen_res: string | null;
    connection_type: string | null;
    language: string | null;
    lcp: number | null;
    fcp: number | null;
    cls: number | null;
    inp: number | null;
}
