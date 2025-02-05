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
                    const cookie = await fetch_Cookie_FromPostLogin(credential.email, credential.password);
                    return {
                        X_CSRF_TOKEN: "",
                        COOKIE: cookie
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

const fetch_Cookie_FromPostLogin = async (email: string, password: string): Promise<string> => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();
        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from Soumettre');
        }

        const formData = new URLSearchParams();
        formData.append('_token', getValidationData.CSRF_TOKEN);
        formData.append('email', email);
        formData.append('password', password);

        console.log(getValidationData)

        const response = await axios.post(SOUMETTRE_API_URL, formData.toString(), {
            headers: {
                'Cookie': getValidationData.COOKIE,
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document',
                'host': 'soumettre.fr',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            }
        });

        const setCookies = response.headers['set-cookie'] || [];
        const cookieOrigin = setCookies.join('; ');

        console.log("Set-Cookie Header:", response.headers['set-cookie']);


        const xsrfTokenMatch = cookieOrigin.match(/XSRF-TOKEN=[^;]+;/);
        const laravelSessionMatch = cookieOrigin.match(/laravel_session=[^;]+;/);
        const laravelTokenMatch = cookieOrigin.match(/laravel_token=[^;]+/);


        if (xsrfTokenMatch && laravelSessionMatch && laravelTokenMatch) {
            return `${xsrfTokenMatch[0]} ${laravelSessionMatch[0]} ${laravelTokenMatch[0]}`.trim();
        } else {
            console.log("Some required cookies were not found.");
        }

        return '';

    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Soumettre");
        return errorDetails.context;
    }
};

const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async (): Promise<{ CSRF_TOKEN: string; COOKIE: string } | null> => {
    try {
        const response = await axiosInstance.get(SOUMETTRE_API_URL, {
            headers: {
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document',
                'host': 'soumettre.fr',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            },
            maxRedirects : 0,
            withCredentials: true,
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
