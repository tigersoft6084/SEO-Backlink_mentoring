import { MARKETPLACE_NAME_BACKLINKED } from "@/globals/strings.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts"
import { BACKLINKED_API_URL_GET } from "@/globals/globalURLs.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { BAKCLINKED_API_URL_POST } from '../../../globals/globalURLs.ts';

export const getCookieFromBacklinked = async () : Promise<{ X_XSRF_TOKEN: string; COOKIE: string } | null> => {

    const credentials = await getCredentialsForMarketplaces();

    for(const credential of credentials){

        const hasBacklinkedTarget = credential.websiteTarget.some((target : {value : string}) => target.value === MARKETPLACE_NAME_BACKLINKED);

        if(hasBacklinkedTarget){

            console.log(`Found Backlinked credential for ${credential.email}`);

            if(credential.password){

                const validationData = await fetchCookieFromBacklinked(credential.email, credential.password);

                return validationData;
            }
        }
    }

    return null;
}

const fetch_CSRF_TOKEN_from_GET_Login = async (): Promise<{ X_XSRF_TOKEN: string; COOKIE: string } | null> => {
    try {
        const response = await fetch(BACKLINKED_API_URL_GET, { method: 'GET' });

        // Check if response is successful
        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch validation data');
        }

        // Get the set-cookie header
        const setCookieHeader = response.headers.get('set-cookie');
        if (!setCookieHeader) {
            console.error('No set-cookie header found in the response.');
            return null;
        }

        // Extract tokens
        const xsrfTokenMatch = setCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
        const sessionTokenMatch = setCookieHeader.match(/backlinked_session=([^;]+)/);

        if (xsrfTokenMatch && sessionTokenMatch) {
            const X_XSRF_TOKEN = xsrfTokenMatch[1];
            const COOKIE = `XSRF-TOKEN=${X_XSRF_TOKEN}; backlinked_session=${sessionTokenMatch[1]}`;
            return {
                X_XSRF_TOKEN : X_XSRF_TOKEN,
                COOKIE
            };
        } else {
            console.log('One or both tokens not found in the cookies.');
        }

        return null;
    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, 'Error fetching validation data for Backlinked');
        console.log(errorDetails);
        return null;
    }
};

const fetchCookieFromBacklinked = async (email: string, password: string): Promise<{ X_XSRF_TOKEN: string; COOKIE: string } | null> => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_from_GET_Login();

        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from Backlinked');
        }

        const response = await fetch(BAKCLINKED_API_URL_POST, {
            method: 'POST',
            headers: {
                Cookie: getValidationData.COOKIE,
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(getValidationData.X_XSRF_TOKEN),
                Accept: 'application/json',
                Host: 'app.backlinked.com',
                'Referer' : 'https://app.backlinked.com/login',
                'Referrer-Policy' : 'strict-origin-when-cross-origin'
            },
            body: JSON.stringify({
                email,
                password,
                remember: true
            })
        });

        if (!response.ok) {
            throw new Error('Failed to login to Backlinked');
        }

        const setCookieHeader = response.headers.get('set-cookie');
        if (!setCookieHeader) {
            throw new Error('Login successful, but no cookies received.');
        }

        const xsrfTokenMatch = setCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
        const sessionTokenMatch = setCookieHeader.match(/backlinked_session=([^;]+)/);

        if (xsrfTokenMatch && sessionTokenMatch) {
            const X_XSRF_TOKEN = xsrfTokenMatch[1];
            const COOKIE = `XSRF-TOKEN=${X_XSRF_TOKEN}; backlinked_session=${sessionTokenMatch[1]}`;
            return {
                X_XSRF_TOKEN : decodeURIComponent(X_XSRF_TOKEN),
                COOKIE
            };
        } else {
            console.log('One or both tokens not found in the cookies.');
        }

        return null;
    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, 'Error fetching validation data for Backlinked');
        console.error(errorDetails);
        return null;
    }
};

