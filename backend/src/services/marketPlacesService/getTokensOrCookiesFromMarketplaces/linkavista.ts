import * as cheerio from 'cheerio';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { LINKAVISTA_API_URL } from '@/globals/globalURLs.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

export const getCookieFromLinkaVista = async () : Promise<string | null> => {

    try {
        const credentials = await getCredentialsForMarketplaces();

        // Iterate through the credentials and fetch cookie for Linkavista
        for (const credential of credentials) {
            const hasLinkavistaTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'Linkavista');

            if (hasLinkavistaTarget) {
                console.log(`Found Linkavista credentials for ${credential.email}`);

                // Fetch cookie from Linkavista API
                if (credential.password) {
                    const cookie = await fetch_Cookie_FromPostLogin(credential.email, credential.password);

                    return cookie;
                }
            }
        }
        return null; // Return null if no Linkavista credentials found
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in getCookieFromLinkavista:', error.message);
        } else {
            console.error('Error in getCookieFromLinkavista:', error);
        }
        return null;
    }
}

const fetch_Cookie_FromPostLogin = async (email: string, password: string): Promise<string> => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();

        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from Linkavista');
        }

        const formData = new URLSearchParams();
        formData.append('_token', getValidationData.CSRF_TOKEN);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('remember', "on");

        const response = await fetch(LINKAVISTA_API_URL, {
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
            throw new Error('Failed to log in to Linkavista');
        }

        // Extract cookies from the response headers
        const setCookieHeader = response.headers.get('set-cookie') || '';

        const xsrfTokenMatch = setCookieHeader.match(/XSRF-TOKEN=[^;]+;/);
        const sessionTokenMatch = setCookieHeader.match(/linkavista_session=[^;]+;/);
        const remember_webMatch = setCookieHeader.match(/remember_web_[^=]+=[^;]+;/);

        if (xsrfTokenMatch && sessionTokenMatch && remember_webMatch) {
            const extractedCookie = `${xsrfTokenMatch[0]} ${sessionTokenMatch[0]} ${remember_webMatch[0]}`.trim();

            return extractedCookie;

        } else {
            console.log("One or both tokens not found.");
        }

        return '';

    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Linkavista : ");
        return errorDetails.context;
    }
};


const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async (): Promise<{CSRF_TOKEN : string; COOKIE : string} | null> => {
    try {
        const response = await fetch(LINKAVISTA_API_URL, { method: 'GET' });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch validation data');
        }

        const responseBody = await response.text();
        const $ = cheerio.load(responseBody);

        // Select the meta tag with the name "csrf-token" and get its content attribute
        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        if (!csrfToken) {
            throw new Error('CSRF token not found in the HTML response');
        }

        const cookieOrigin = response.headers.get('set-cookie') || "";

        const xsrfTokenMatch = cookieOrigin.match(/XSRF-TOKEN=[^;]+;/);
        const sessionTokenMatch = cookieOrigin.match(/linkavista_session=[^;]+;/);

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
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Linkavistar : ");
        console.log(errorDetails, status)
        return null;
    }
};
