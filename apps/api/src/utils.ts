export function getErrLog(e: unknown): {
    errMsg?: string;
    errName?: string;
    errStack?: string;
} {
    return {
        errMsg: (e as Error)?.message,
        errName: (e as Error)?.name,
        errStack: (e as Error)?.stack,
    };
}
