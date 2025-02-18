
import { LINKSCLUB_API_URL } from "@/globals/globalURLs.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { MARKETPLACE_NAME_LINKSCLUB } from "@/globals/strings.ts";

// Function to fetch cookie from Linksclub API using fetch
const fetchCookieFromLinksclub = async (email: string, password: string): Promise<string> => {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('log_lang', 'fr_FR');
    formData.append('password', password);
    formData.append('login', '');

    try {
        const response = await fetch(LINKSCLUB_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Upgrade-Insecure-Requests': '1',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            redirect: 'manual',  // Prevent automatic redirects
        });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            return '';
        }

        // Extract cookies from the response headers
        const setCookieHeader = response.headers.get('set-cookie') || '';
        console.log(setCookieHeader)
        if(setCookieHeader){
            const cookies = extractPHPSESSID(setCookieHeader);
            return cookies || '';
        }

        return '';

    } catch (error) {

        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Linksclub : ");
        return errorDetails.context;
    }

};

// Function to extract PHPSESSID and transform into JSON
const extractPHPSESSID = (cookieString: string): string | null => {
    // Split the cookie string by semicolons
    const cookies = cookieString.split(';');

    // Loop through each cookie to find PHPSESSID
    for (const cookie of cookies) {

        const trimmedCookie = cookie.trim(); // Trim any whitespace
        if (trimmedCookie.startsWith('PHPSESSID=')) {
            return trimmedCookie;
        }
    }

    // Return null if PHPSESSID is not found
    return null;
};

// Main function to fetch credentials and compare website target
export const getCookieFromLinksclub = async (): Promise<string | null> => {
    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch cookie for Linksclub
    for (const credential of credentials) {
        // Check if any value in websiteTarget array is 'Linksclub'
        const hasLinksclubTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_LINKSCLUB);

        if (hasLinksclubTarget) {
        console.log(`Found Linksclub credentials for ${credential.email}`);

        // Fetch cookie from Linksclub API
        if (credential.password) {
            const cookie = await fetchCookieFromLinksclub(credential.email, credential.password);

            return cookie;
        }
        }
    }

    return null; // Return null if no Linksclub credentials found
};
