import * as cheerio from 'cheerio';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { MARKETPLACE_NAME_MYNILINKS } from '@/globals/strings.ts';
import { MYNILINKS_API_URL } from '@/globals/globalURLs.ts';


export const getCookieFromMynilinks = async () : Promise<string | null> => {

    try {
        const credentials = await getCredentialsForMarketplaces();

        // Iterate through the credentials and fetch cookie for Mynilinks
        for (const credential of credentials) {
            const hasMynilinksTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_MYNILINKS);

            if (hasMynilinksTarget) {
                console.log(`Found Mynilinks credentials for ${credential.email}`);

                // Fetch cookie from Mynilinks API
                if (credential.password) {
                    const cookie = await fetch_Cookie_FromPostLogin(credential.email, credential.password);

                    return cookie;
                }
            }
        }
        return null; // Return null if no Mynilinks credentials found
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in getCookieFromMynilinks:', error.message);
        } else {
            console.error('Error in getCookieFromMynilinks:', error);
        }
        return null;
    }
}

const fetch_Cookie_FromPostLogin = async (email: string, password: string): Promise<string> => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();

        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from Mynilinks');
        }

        const formData = new URLSearchParams();
        formData.append('_token', getValidationData.CSRF_TOKEN);
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch(MYNILINKS_API_URL, {
            method: 'POST',
            headers: {
                'Cookie' : getValidationData.COOKIE,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            redirect: 'manual',  // Prevent automatic redirects
        });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to log in to Mynilinks');
        }

        // Extract cookies from the response headers
        const setCookieHeader = response.headers.get('set-cookie') || '';

        const xsrfTokenMatch = setCookieHeader.match(/XSRF-TOKEN=[^;]+;/);
        const sessionTokenMatch = setCookieHeader.match(/mynilinks_session=[^;]+/);

        if (xsrfTokenMatch && sessionTokenMatch) {
            const extractedCookie = `${xsrfTokenMatch[0]} ${sessionTokenMatch[0]}`.trim();

            return extractedCookie;

        } else {
            console.log("One or both tokens not found.");
        }

        return '';

    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Mynilinks : ");
        return errorDetails.context;
    }
};


const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async (): Promise<{CSRF_TOKEN : string; COOKIE : string} | null> => {
    try {
        const response = await fetch(MYNILINKS_API_URL, { method: 'GET' });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch validation data');
        }

        const responseBody = await response.text();
        const $ = cheerio.load(responseBody);

        // Select the input tag with the name "csrf-token" and get its content attribute
        const csrfToken = $('input[name="_token"]').attr('value');
        if (!csrfToken) {
            throw new Error('CSRF token not found in the HTML response');
        }

        const cookieOrigin = response.headers.get('set-cookie') || "";

        const xsrfTokenMatch = cookieOrigin.match(/XSRF-TOKEN=[^;]+;/);
        const sessionTokenMatch = cookieOrigin.match(/mynilinks_session=[^;]+/);

        if (xsrfTokenMatch && sessionTokenMatch) {
            const extractedCookie = `${xsrfTokenMatch[0]} ${sessionTokenMatch[0]}`.trim();

            return {
                CSRF_TOKEN: csrfToken,
                COOKIE : extractedCookie
            };

        }

        console.warn('One or more required cookies not found in the response headers');
        return null;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Mynilinksr : ");
        console.log(errorDetails, status)
        return null;
    }
};