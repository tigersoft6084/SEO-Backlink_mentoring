import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { UNANCOR_API_URL, UNANCOR_API_URL_FOR_FINAL_COOKIE, UNANCOR_API_URL_POST } from '@/globals/globalURLs.ts';
import * as cheerio from 'cheerio';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import axios from 'axios';

export const getCookieAndCSRFTokenFromUnancor = async() => {

    const credentials = await getCredentialsForMarketplaces();

    for(const credential of credentials){

        const hasUnancorTarget = credential.websiteTarget.some((target : { value : string }) => target.value === 'Unancor');

        if(hasUnancorTarget){

            console.log(`Found Unancor credentials for ${credential.email}`);

            if(credential.password){

                const cookie = await fetchCookieFromUnancor_POST_Login(credential.email, credential.password);

                return cookie;
            }
        }
    }
}

const fetchCookieFromUnancor_POST_Login = async (email: string, password: string): Promise<{CSRF_TOKEN : string; COOKIE : string} | null> => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();

        if (!getValidationData) {
            throw new Error(`Failed to fetch CSRF token or initial cookies from Unancor`);
        }

        const requestBody = {
            "_token": getValidationData.CSRF_TOKEN,
            "components": [
                {
                    "snapshot": "{\"data\":{\"data\":[{\"email\":null,\"password\":null,\"remember\":false},{\"s\":\"arr\"}],\"mountedActions\":[[],{\"s\":\"arr\"}],\"mountedActionsArguments\":[[],{\"s\":\"arr\"}],\"mountedActionsData\":[[],{\"s\":\"arr\"}],\"defaultAction\":null,\"defaultActionArguments\":null,\"componentFileAttachments\":[[],{\"s\":\"arr\"}],\"mountedFormComponentActions\":[[],{\"s\":\"arr\"}],\"mountedFormComponentActionsArguments\":[[],{\"s\":\"arr\"}],\"mountedFormComponentActionsData\":[[],{\"s\":\"arr\"}],\"mountedFormComponentActionsComponents\":[[],{\"s\":\"arr\"}],\"mountedInfolistActions\":[[],{\"s\":\"arr\"}],\"mountedInfolistActionsData\":[[],{\"s\":\"arr\"}],\"mountedInfolistActionsComponent\":null,\"mountedInfolistActionsInfolist\":null},\"memo\":{\"id\":\"mHVgv22IcIGJUJMydWh5\",\"name\":\"app.filament.auth.app-login\",\"path\":\"login\",\"method\":\"GET\",\"children\":[],\"scripts\":[],\"assets\":[],\"errors\":[],\"locale\":\"en\"},\"checksum\":\"e888a062ef5cd82ddc8c945d24f6a11c0bb9739bf6196722f33db7c5967415c2\"}",
                    "updates": {
                        "data.email": email,
                        "data.password": password
                    },
                    "calls": [
                        {
                            "path": "",
                            "method": "authenticate",
                            "params": []
                        }
                    ]
                }
            ]
        };

        const headers = {
            'Cookie' : getValidationData.COOKIE,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', // Mimics a browser
            'Content-Type': 'application/json', // Indicates JSON payload
            'Accept': '*/*', // Accept all types of content
            'Host': 'app.unancor.com', // Host header for the target domain
            'Sec-CH-UA': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
            'Sec-CH-UA-Mobile': '?0', // Indicates a non-mobile device
            'Sec-CH-UA-Platform': '"Windows"', // Specifies platform as Windows
            'X-Livewire' : ''
        };

        const response = await axios.post(UNANCOR_API_URL_POST, requestBody, {
            headers: headers
        });

        // Extract cookies from the response headers
        const setCookieHeaders = response.headers['set-cookie'] || [];

        const combinedCookies = setCookieHeaders.join('; ');
        const xsrfTokenMatch = combinedCookies.match(/XSRF-TOKEN=[^;]+;/);
        const unancorMatchSession = combinedCookies.match(/unancor_match_session=[^;]+;/);

        if (xsrfTokenMatch && unancorMatchSession) {
            const extractedCookie = `${xsrfTokenMatch[0]} ${unancorMatchSession[0]}`.trim();
            const finalCookie = await fetchFinalCookieAndCSRFToken(extractedCookie);

            return {
                CSRF_TOKEN: finalCookie?.CSRF_TOKEN || '',
                COOKIE : finalCookie?.COOKIE || ''
            };
        } else {
            console.log("One or more required cookies not found.");
        }

        return null;
    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Unancor:");
        console.log(errorDetails);
        throw error;
    }
};

const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async() : Promise<{CSRF_TOKEN : string; COOKIE : string} | null> => {

    try{

        const response = await fetch(UNANCOR_API_URL, {method : 'GET'});

        if(!response.ok && response.status !== 302){
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch validation data');
        }

        const responseBody = await response.text();
        const $ = cheerio.load(responseBody);

        const csrfToken = $('meta[name="csrf-token"]').attr('content');

        if(!csrfToken){
            throw new Error('CSRF token not found in the HTML response for Unancor');
        }

        const cookieOrigin = response.headers.get('set-cookie') || '';

        const xsrfTokenMatch = cookieOrigin.match(/XSRF-TOKEN=[^;]+;/);
        const sessionTokenMatch = cookieOrigin.match(/unancor_match_session=[^;]+/);

        if (xsrfTokenMatch && sessionTokenMatch) {
            const extractedCookie = `${xsrfTokenMatch[0]} ${sessionTokenMatch[0]}`.trim();

            return {
                CSRF_TOKEN: csrfToken,
                COOKIE : extractedCookie
            };

        }

        console.warn('One or more required cookies not found in the response headers');
        return null;
    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Unancor : ");
        console.log(errorDetails, status);
        return null;
    }
}

const fetchFinalCookieAndCSRFToken = async (extractedCookie: string): Promise<{ CSRF_TOKEN: string; COOKIE: string } | null> => {
    if (!extractedCookie) {
        throw new Error('ExtractedCookie not found!');
    }

    try {
        const response = await fetch(UNANCOR_API_URL_FOR_FINAL_COOKIE, {
            method: 'GET',
            headers: {
                'Cookie': extractedCookie,
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        // Parse the response body as text
        const responseBody = await response.text();
        const $ = cheerio.load(responseBody);

        // Extract the CSRF token from the meta tag
        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        if (!csrfToken) {
            throw new Error('CSRF token not found in the HTML response');
        }

        // Extract cookies from the 'set-cookie' header
        const setCookieHeaders = response.headers.get('set-cookie');
        if (!setCookieHeaders) {
            throw new Error('Set-Cookie header is missing in the response');
        }

        // Combine cookies into a single string for parsing
        const combinedCookies = setCookieHeaders.split(',').join('; ');

        // Match specific cookies
        const xsrfTokenMatch = combinedCookies.match(/XSRF-TOKEN=[^;]+;/);
        const unancorMatchSession = combinedCookies.match(/unancor_match_session=[^;]+;/);
        const unancorProject = combinedCookies.match(/unancor_project=[^;]+/);

        if (xsrfTokenMatch && unancorMatchSession && unancorProject) {
            const extractedFinalCookie = `${xsrfTokenMatch[0]} ${unancorMatchSession[0]} ${unancorProject[0]}`.trim();

            console.log('Extracted Final Cookie:', extractedFinalCookie);
            return {
                CSRF_TOKEN: csrfToken,
                COOKIE: extractedFinalCookie,
            };
        } else {
            console.log("One or more required tokens not found in cookies.");
        }

        return null;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Linkavistar : ");
        console.log(errorDetails, status)
        return null;
    }
};

