export const log = {
    info: (msg: string, ...rest: unknown[]) => console.log(`[INFO] ${msg}`, ...rest),
    error: (msg: string, ...rest: unknown[]) => console.error(`[ERROR] ${msg}`, ...rest),
    warn: (msg: string, ...rest: unknown[]) => console.warn(`[WARN] ${msg}`, ...rest),
};
