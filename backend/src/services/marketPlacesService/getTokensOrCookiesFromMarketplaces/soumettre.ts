import axios from 'axios';
import * as cheerio from 'cheerio';
import { SOUMETTRE_API_URL } from "@/globals/globalURLs.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import { MARKETPLACE_NAME_SOUMETTRE } from "@/globals/strings.ts";

const axiosInstance = axios.create({
    withCredentials: true, // Ensures cookies are included
});

axiosInstance.interceptors.response.use(async (response) => {
    if (response.status === 302) {
        const redirectUrl = response.headers.location;
        return await axiosInstance.get(redirectUrl);
    }
    return response;
});

export const getCookieAndXCsrfTokenFromSoumettre = async (): Promise<{ X_CSRF_TOKEN: string; COOKIE: string } | null> => {
    try {
        const credentials = await getCredentialsForMarketplaces();
        for (const credential of credentials) {
            const hasSoumettreTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_SOUMETTRE);
            if (hasSoumettreTarget) {
                console.log(`Found Soumettre credentials for ${credential.email}`);
                if (credential.password) {
                    const validationData = await fetchFinalCookieFromDashboard(credential.email, credential.password);
                    return {
                        X_CSRF_TOKEN: validationData?.X_CSRF_TOKEN || '',
                        COOKIE: validationData?.COOKIE || ''
                    };
                }
            }
        }
        return null;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Soumettre");
        console.log(errorDetails, status);
        return null;
    }
};

const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async (): Promise<{ CSRF_TOKEN: string; COOKIE: string } | null> => {
    try {
        const response = await axiosInstance.get(SOUMETTRE_API_URL, {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://soumettre.fr/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        });

        const responseBody = response.data;

        const $ = cheerio.load(responseBody);

        // Find script that contains csrfToken
        const scriptContent = $('script')
            .filter((_, el) => !!$(el).html()?.includes('"csrfToken"'))
            .html();

        const csrfTokenMatch = scriptContent?.match(/"csrfToken":"([^"]+)"/);
        const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : '';

        if (!csrfToken) throw new Error('CSRF Token not found in HTML.');

        const setCookies = response.headers['set-cookie'] || [];

        const cookieOrigin = setCookies.join('; ');

        const xsrfTokenMatch = cookieOrigin.match(/XSRF-TOKEN=[^;]+;/);
        const sessionTokenMatch = cookieOrigin.match(/laravel_session=[^;]+/);

        if (xsrfTokenMatch && sessionTokenMatch) {

            return {
                CSRF_TOKEN: csrfToken,
                COOKIE: `${xsrfTokenMatch[0]} ${sessionTokenMatch[0]}`.trim()
            };
        }

        return null;

    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Soumettre");
        console.log(errorDetails);
        return null;
    }
};

const fetch_Cookie_FromPostLogin = async (email: string, password: string): Promise<{ X_CSRF_TOKEN: string; COOKIE: string } | null> => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();
        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from Soumettre');
        }

        const formData = new URLSearchParams();
        formData.append('_token', getValidationData.CSRF_TOKEN);
        formData.append('email', email);
        formData.append('password', password);

        const response = await axiosInstance.post(SOUMETTRE_API_URL, formData.toString(), {
            headers: {
                'Cookie': getValidationData.COOKIE,
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                'host' : 'soumettre.fr',
                'origin' : 'https://soumettre.fr',
                "Referer": "https://soumettre.fr/login",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            withCredentials: true, // Ensures cookies are included
        });

        const setCookies = response.headers['set-cookie'] || [];
        const cookieOrigin = setCookies.join('; ');

        const xsrfTokenMatch = cookieOrigin.match(/XSRF-TOKEN=[^;]+;/);
        const laravelSessionMatch = cookieOrigin.match(/laravel_session=[^;]+/);
        // const laravelTokenMatch = cookieOrigin.match(/laravel_token=[^;]+/);

        const responseBody = response.data;

        const $ = cheerio.load(responseBody);

        // Find script that contains csrfToken
        const scriptContent = $('script')
            .filter((_, el) => !!$(el).html()?.includes('"csrfToken"'))
            .html();

        const csrfTokenMatch = scriptContent?.match(/"csrfToken":"([^"]+)"/);
        const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : '';

        if (!csrfToken) throw new Error('CSRF Token not found in HTML.');


        if (xsrfTokenMatch && laravelSessionMatch) {
            const cookie = `${xsrfTokenMatch[0]}; ${laravelSessionMatch[0]}`;

            return{
                X_CSRF_TOKEN : csrfToken,
                COOKIE : cookie || ''
            }
        } else {
            console.log("Some required cookies were not found.");
        }

        return null;

    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Soumettre");
        console.log(errorDetails.context);
        return null;
    }
};

const fetchFinalCookieFromDashboard = async(email: string, password: string) : Promise<{ X_CSRF_TOKEN: string; COOKIE: string } | null> => {

    try{
        const getValidationData = await fetch_Cookie_FromPostLogin(email, password);

        const response = await axiosInstance.get('https://soumettre.fr/user/dashboard', {
            headers: {
                'Cookie' : getValidationData?.COOKIE,
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                HOST : 'soumettre.fr',
                "Referer": "https://soumettre.fr/login",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
        });

        const setCookies = response.headers['set-cookie'] || [];
        const cookieOrigin = setCookies.join('; ');

        const allCookies = extractCookies(setCookies);

        console.log("Set-Cookie Header>>>>>>>>>>>>", allCookies)

        const xsrfTokenMatch = cookieOrigin.match(/XSRF-TOKEN=[^;]+;/);
        const laravelSessionMatch = cookieOrigin.match(/laravel_session=[^;]+/);

        if (xsrfTokenMatch && laravelSessionMatch) {
            const cookie = `${xsrfTokenMatch[0]}; ${laravelSessionMatch[0]}`;
            return{
                X_CSRF_TOKEN : getValidationData?.X_CSRF_TOKEN || '',
                COOKIE : cookie || ''
            }
        } else {
            console.log("Some required cookies were not found.");
        }

        return null;
    }catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Soumettre");
        console.log(errorDetails.context);
        return null;
    }
}

const extractCookies = (setCookiesArray: string[]): string => {
    return setCookiesArray
        .map(cookie => cookie.split(';')[0]) // Take only the cookie value, ignore metadata
        .join('; '); // Join cookies in a valid format
};
