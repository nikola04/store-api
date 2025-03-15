interface Device {
    user_agent: string;
    type?: string;
    vendor?: string;
    model?: string;
    ip?: string;
}

interface Authorization {
    access_token?: string;
}

declare namespace Express {
    export interface Request {
        device: Device;
        authorization?: Authorization;
    }
}
