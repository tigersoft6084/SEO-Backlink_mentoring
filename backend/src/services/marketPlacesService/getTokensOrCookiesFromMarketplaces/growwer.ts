import { GROWWER_API_URL } from "@/globals/globalURLs.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { MARKETPLACE_NAME_GROWWER } from "@/globals/strings.ts";
import * as cheerio from 'cheerio';

// Function to fetch cookie from Growwer API using fetch
const fetchCookieFromGrowwer = async (email: string, password: string): Promise<string> => {


    try {

        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();

        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from Linkavista');
        }

        console.log(getValidationData)

        const formData = new URLSearchParams();
        formData.append('_username', email);
        formData.append('_password', password);
        formData.append('_csrf_token', getValidationData.CSRF_TOKEN)

        const response = await fetch(GROWWER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            redirect: 'manual',  // Prevent automatic redirects
        });

        // Extract cookies from the response headers
        const setCookieHeader = response.headers.get('set-cookie') || '';

        const cookie = setCookieHeader.split(/[,;]\s*/)
            .find(cookie => cookie.startsWith("PHPSESSID=")) || null;

        console.log(cookie)

        if (cookie) {
            return cookie;
        } else {
            console.log("PHP session token not found.");
            return '';
        }

    } catch (error) {

        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Growwer : ");
        return errorDetails.context;

    }

};

const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async (): Promise<{CSRF_TOKEN : string; COOKIE : string} | null> => {
    try {
        const response = await fetch(GROWWER_API_URL, { method: 'GET' });

        const responseBody = await response.text();
        const $ = cheerio.load(responseBody);

        // Select the meta tag with the name "csrf-token" and get its content attribute
        const csrfToken = $('input[name="_csrf_token"]').attr('value');
        if (!csrfToken) {
            throw new Error('CSRF token not found in the HTML response');
        }

        const cookieOrigin = response.headers.get('set-cookie') || "";

        const cookie = extractPHPSESSID(cookieOrigin);

        if (cookie) {

            return {
                CSRF_TOKEN: csrfToken,
                COOKIE : cookie
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

// Main function to fetch credentials and compare website target
export const getCookieFromGrowwer = async (): Promise<string | null> => {
    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch cookie for Growwer
    for (const credential of credentials) {
        // Check if any value in websiteTarget array is 'Growwer'
        const hasGrowwerTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_GROWWER);

        if (hasGrowwerTarget) {
        console.log(`Found Growwer credentials for ${credential.email}`);

        // Fetch cookie from Growwer API
        if (credential.password) {
            const cookie = await fetchCookieFromGrowwer(credential.email, credential.password);

            return cookie;
        }
        }
    }

    return null; // Return null if no Growwer credentials found
};

const extractPHPSESSID = (cookieString: string): string | null => {
    return cookieString
        .split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith('PHPSESSID='))
        || null;
};
