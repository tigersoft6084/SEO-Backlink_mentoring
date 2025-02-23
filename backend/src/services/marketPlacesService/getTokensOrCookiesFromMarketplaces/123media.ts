import * as cheerio from 'cheerio';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { MARKETPLACE_NAME_123MEDIA } from '@/globals/strings.ts';
import { MEDIA123_API_URL } from '@/globals/globalURLs.ts';

export const getCookieFrom123media = async () => {

    try {
        const credentials = await getCredentialsForMarketplaces();

        // Iterate through the credentials and fetch cookie for 123media
        for (const credential of credentials) {
            const has123mediaTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_123MEDIA);

            if (has123mediaTarget) {
                console.log(`Found 123media credentials for ${credential.email}`);

                // Fetch cookie from 123media API
                if (credential.password) {
                    const response = await fetch_Cookie_FromPostLogin(credential.email, credential.password);

                    return response;
                }
            }
        }
        return null; // Return null if no 123media credentials found
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in getCookieFrom123media:', error.message);
        } else {
            console.error('Error in getCookieFrom123media:', error);
        }
        return null;
    }
}

const fetch_Cookie_FromPostLogin = async (email: string, password: string) : Promise<{catSearchToken : string; COOKIE : string} | null> => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();

        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from 123media');
        }
        console.log(getValidationData)

        const formData = new URLSearchParams();

        formData.append('email', email);
        formData.append('password', password);
        formData.append('_csrf_token', getValidationData.CSRF_TOKEN);


        // Step 1: Send POST request to login
        const loginResponse = await fetch(MEDIA123_API_URL, {
            method: 'POST',
            headers: {
                'Cookie' : getValidationData.COOKIE,
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                'host' : '123.media'
            },
            body: formData.toString()
        });

        const cookieOrigin = loginResponse.headers.get('set-cookie') || "";

        let cookies;

        if(cookieOrigin){
            cookies = extractPHPSESSID(cookieOrigin);
        }
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', cookies)

        const responseBody = await loginResponse.text();
        const $ = cheerio.load(responseBody);

        // Extract the token value
        const catSearchToken = $('#cat_search__token').attr('value');

        return {
            catSearchToken : responseBody || '',
            COOKIE : cookies || ''
        }
    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, 'Error fetching validation data for 123media: ');
        console.error(errorDetails.context);
        return null;
    }
};


export const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async (): Promise<{CSRF_TOKEN : string; COOKIE : string} | null> => {
    try {
        const response = await fetch(MEDIA123_API_URL, {
            method: 'GET',
            headers : {
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
                'host' : '123.media',
            }
        });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch validation data');
        }

        const responseBody = await response.text();
        const $ = cheerio.load(responseBody);

        // Select the meta tag with the name "csrf-token" and get its content attribute
        const csrfToken = $('input[name="_csrf_token"]').attr('value');
        if (!csrfToken) {
            throw new Error('CSRF token not found in the HTML response');
        }

        const cookieOrigin = response.headers.get('set-cookie') || "";

        if(cookieOrigin){
            const cookies = extractPHPSESSID(cookieOrigin);

            return {
                CSRF_TOKEN : csrfToken || '',
                COOKIE : cookies || ''
            }
        }


        console.warn('One or more required cookies not found in the response headers');
        return null;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for 123mediar : ");
        console.log(errorDetails, status)
        return null;
    }
};

const extractPHPSESSID = (cookieString: string): string | null => {
    return cookieString
        .split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith('PHPSESSID='))
        || null;
};
