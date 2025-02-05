import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CookieJar } from 'tough-cookie';

declare module 'axios-cookiejar-support' {
    export function wrapper(client: AxiosInstance): AxiosInstance;
}

declare module 'axios' {
    export interface AxiosRequestConfig {
        jar?: CookieJar;
        withCredentials?: boolean;
    }
}
