export const getAllowedOrigins = (): string[] => {
    const origins: string[] = [];
    const origins_string = process.env.ALLOWED_ORIGINS;
    if (!origins_string) return origins;
    origins_string.split(',').forEach(origin => {
        origin = origin.trim();
        if(!origin.startsWith('http://') && !origin.startsWith('https://')) return;
        origins.push(origin);
    });
    return origins;
};
