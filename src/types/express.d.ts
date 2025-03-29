type DeviceType = 'Desktop'|'Mobile'|'Tablet'|'SmartTV'|'Console'|'Embedded'|'Wearable'|'XR'
type DeviceOS = 'MacOS'|'Windows'|'IOS'|'Android'|'Linux'|'ChromeOS'|'Linux'|'Playstation'|'Nintendo'|'Xbox'

interface Device {
    user_agent: string;
    name?: string;
    type?: DeviceType;
    os?: DeviceOS;
    app?: string;
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
