export function getCurrentDate(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getCurrentTime(): number {
    return Date.now();
}

export function getPreviousHourTimestamp(): number {
    const now = Date.now();
    const currentHour = Math.floor(now / 3600000) * 3600000;
    return currentHour - 3600000;
}

export function getPreviousDayTimestamp(): number {
    const now = Date.now();
    const currentDay = Math.floor(now / 86400000) * 86400000;
    return currentDay - 86400000;
}

export function getHourTimestamp(timestamp: number): number {
    return Math.floor(timestamp / 3600000) * 3600000;
}

export function getDayTimestamp(timestamp: number): number {
    return Math.floor(timestamp / 86400000) * 86400000;
}

export function getCutoffTimestamp(days: number): number {
    return Date.now() - (days * 24 * 60 * 60 * 1000);
}
