import * as cheerio from 'cheerio';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { MARKETPLACE_NAME_123MEDIA } from '@/globals/strings.ts';
import { MEDIA123_API_URL } from '@/globals/globalURLs.ts';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axios from 'axios';

// Initialize axios with cookie support
const jar = new CookieJar(); // Create a cookie jar
const client = wrapper(axios.create({ jar, withCredentials: true })); // Wrap axios with cookie support


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

const fetch_Cookie_FromPostLogin = async (email: string, password: string) => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();

        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from 123media');
        }

        // Step 1: Send POST request to login
        const loginResponse = await client.post(
            MEDIA123_API_URL,
            new URLSearchParams({
                email: email,
                password: password,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Referer: MEDIA123_API_URL,
                },
                maxRedirects: 0, // Prevent axios from automatically following redirects
                validateStatus: (status) => status === 200 || status === 302, // Handle both 200 and 302
            }
        );

        const cookieOrigin = loginResponse.headers['set-cookie'] || "";

        const cookies = extractPHPSESSID(Array.isArray(cookieOrigin) ? cookieOrigin.join('; ') : cookieOrigin);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', cookies)

        console.log('Login Response Status:', loginResponse.status);
        console.log('Login Response Headers:', loginResponse.headers);

        // Step 2: Extract cookies and handle the response
        if ((loginResponse.status === 200 || loginResponse.status === 302) && loginResponse.headers['set-cookie']) {
            console.log('Login successful, session cookie set.');

            // Follow the redirect manually to GET /offers
            const offersResponse = await client.get('https://123.media/offers', {
                headers: {
                    Referer: 'https://123.media/login',
                    'Cookie': cookies
                },
            });

            if (offersResponse.status === 200) {
                return {
                    success: true,
                    offersPageHtml: offersResponse.data, // The HTML content of the /offers page
                };
            }
        }

        throw new Error('Login failed: No valid cookie or token found.');
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
                'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Host' : '123.media',
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

            console.log(">..............................", cookies)
            return {
                CSRF_TOKEN : csrfToken,
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
