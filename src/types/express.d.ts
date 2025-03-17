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

interface BaseRequest { // Both must be included in extractHeaders middleware
    device: Device;
    authorization: Authorization;
}

declare namespace Express {
    interface Request extends BaseRequest {
        user?: {
            id: string;
        }
    };
}
