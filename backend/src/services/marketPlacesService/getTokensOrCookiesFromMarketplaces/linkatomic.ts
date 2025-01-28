import { LINKATOMIC_API_URL } from "@/globals/globalURLs.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts"
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import * as cheerio from 'cheerio';

export const getCookieFromLinkatomic = async () : Promise<string | null> => {

    const credentials = await getCredentialsForMarketplaces();

    for(const credential of credentials){

        const hasLinkatomicTarget = credential.websiteTarget.some((target : { value : string}) => target.value === 'Linkatomic');

        if(hasLinkatomicTarget){

            console.log(`Found Linkatomic credentials for ${credential.email}`);

            if(credential.password){

                const cookie = await fetchCookieFromLinkatomic_POST_Login(credential.email, credential.password);

                return cookie;
            }
        }
    }

    return null;
}

const fetchCookieFromLinkatomic_POST_Login = async(email : string, password : string) : Promise<string | null> => {

    try{

        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();

        if(!getValidationData){
            throw new Error('Failed to fetch CSRF token or initial cookies from Linkatomic');
        }

        const formData = new URLSearchParams();
        formData.append('_csrf_token', getValidationData.CSRF_TOKEN);
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch(LINKATOMIC_API_URL, {

            method : 'POST',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body : formData.toString(),
            redirect : 'manual',

        });

        if(!response.ok && response.status !== 302){
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch cookie from Linkatomic');
        }

        const setCookieHeader = response.headers.get('set-cookie') || '';

        if(setCookieHeader){
            const cookies = extractPHPSESSID(setCookieHeader);
            return cookies || '';
        }

        return '';

    }catch(error){
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Linkbuilders : ");
        return errorDetails.context;
    }
}

const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async() : Promise<{CSRF_TOKEN : string} | null> => {

    try{

        const response = await fetch(LINKATOMIC_API_URL, {method : 'GET'});

        if(!response.ok && response.status !== 302){
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch validation data');
        }

        const responseBody = await response.text();
        const $ = cheerio.load(responseBody);

        const csrfToken = $('input[name="_csrf_token"]').val() as string;

        if(!csrfToken){
            throw new Error('CSRF token not found in the HTML response for Linkatomic');
        }

        return {
            CSRF_TOKEN : csrfToken,
        };
    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Linkbuilders : ");
        console.log(errorDetails, status);
        return null;
    }
}

// Function to extract PHPSESSID and transform into JSON
const extractPHPSESSID = (cookieString: string): string | null => {
    // Split the cookie string by semicolons
    const cookies = cookieString.split(';');

    // Loop through each cookie to find PHPSESSID
    for (const cookie of cookies) {

        const trimmedCookie = cookie.trim(); // Trim any whitespace

        if(trimmedCookie.startsWith('samesite')){
        const cookieParts = trimmedCookie.split(',');

        for(const part of cookieParts){
            const trimmedCookiePart = part.trim();
            if (trimmedCookiePart.startsWith('PHPSESSID=')) {
                return trimmedCookiePart;
            }
        }
        }
    }

    // Return null if PHPSESSID is not found
    return null;
};