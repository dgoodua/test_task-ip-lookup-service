export type IPInfo = IPInfoResponseSuccess | IPInfoResponseFail;

interface IPInfoResponseSuccess {
    ip: string;
    success: boolean;
    type: string;
    continent: string;
    continent_code: string;
    country: string;
    country_code: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
}

interface IPInfoResponseFail {
    success: boolean;
    message: string;
}
