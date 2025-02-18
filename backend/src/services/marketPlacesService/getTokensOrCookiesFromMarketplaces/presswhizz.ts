import * as cheerio from 'cheerio';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { MARKETPLACE_NAME_PRESSWHIZZ } from '@/globals/strings.ts';
import { PRESSWHIZZ_API_URL } from '@/globals/globalURLs.ts';



export const getCookieFromPresswhizz = async () => {

    try {
        const credentials = await getCredentialsForMarketplaces();

        // Iterate through the credentials and fetch cookie for Presswhizz
        for (const credential of credentials) {
            const hasPresswhizzTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_PRESSWHIZZ);

            if (hasPresswhizzTarget) {
                console.log(`Found Presswhizz credentials for ${credential.email}`);

                // Fetch cookie from Presswhizz API
                if (credential.password) {
                    const finalTokenAndCookie = await fetch_Cookie_FromPostLogin(credential.email, credential.password);

                    return finalTokenAndCookie;
                }
            }
        }
        return null; // Return null if no Presswhizz credentials found
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in getCookieFromPresswhizz:', error.message);
        } else {
            console.error('Error in getCookieFromPresswhizz:', error);
        }
        return null;
    }
}

const fetch_Cookie_FromPostLogin = async (email: string, password: string) => {
    try {
        const getValidationData = await fetch_CSRF_TOKEN_AndCookieFrom_GET_Login();

        if (!getValidationData) {
            throw new Error('Failed to fetch CSRF token or initial cookies from Presswhizz');
        }

        const formData = new URLSearchParams();
        formData.append('_csrf_token', getValidationData.CSRF_TOKEN);
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch(PRESSWHIZZ_API_URL, {
            method: 'POST',
            headers: {
                'Cookie' : getValidationData.COOKIE,
                'Content-Type': 'application/x-www-form-urlencoded',
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://app.presswhizz.com/auth/login",
                "Referrer-Policy": "same-origin"
            },
            body: formData.toString(),
            redirect: 'manual',  // Prevent automatic redirects
        });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to log in to Presswhizz');
        }

        // Extract cookies from the response headers
        const setCookieHeader = response.headers.get('set-cookie') || '';

        const xsrfTokenMatch = setCookieHeader.match(/_ps=[^;]+;/);

        if (xsrfTokenMatch) {
            const extractedCookie = `${xsrfTokenMatch[0]}`.trim();

            const finalTokenAndCookie = await fetchTokenFromRedirectedURL(extractedCookie);

            return finalTokenAndCookie;

        } else {
            console.log("One or both tokens not found.");
        }

        return '';

    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Presswhizz : ");
        return errorDetails.context;
    }
};


const fetch_CSRF_TOKEN_AndCookieFrom_GET_Login = async (): Promise<{CSRF_TOKEN : string; COOKIE : string} | null> => {
    try {
        const response = await fetch(PRESSWHIZZ_API_URL, { method: 'GET' });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch validation data');
        }

        const responseBody = await response.text();

        const $ = cheerio.load(responseBody);

        // Select the input tag with the name "csrf-token" and get its content attribute
        const csrfToken = $('input[name="_csrf_token"]').attr('value');

        if (!csrfToken) {
            throw new Error('CSRF token not found in the HTML response');
        }

        const cookieOrigin = response.headers.get('set-cookie') || "";

        const xsrfTokenMatch = cookieOrigin.match(/_ps=[^;]+;/);

        if (xsrfTokenMatch) {
            const extractedCookie = `${xsrfTokenMatch[0]}`.trim();

            return {
                CSRF_TOKEN: csrfToken,
                COOKIE : extractedCookie
            };

        }

        console.warn('One or more required cookies not found in the response headers');
        return null;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Presswhizzr : ");
        console.log(errorDetails, status)
        return null;
    }
};

const fetchTokenFromRedirectedURL = async (cookie: string) => {
    const response = await fetch('https://app.presswhizz.com/marketplace', {
        method: 'GET',
        headers: {
            'Cookie': cookie,
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "Referer": "https://app.presswhizz.com/auth/login",
            "Referrer-Policy": "same-origin"
        }
    });

    const responseBody = await response.text();

    // Load the HTML into Cheerio
    const $ = cheerio.load(responseBody);

    // Extract `data-live-props-value`
    const livePropsValue = $('div[data-live-props-value]').attr('data-live-props-value');

    if (!livePropsValue) {
        console.error("❌ `data-live-props-value` not found.");
        return;
    }

    // Parse JSON safely
    const decodedValue = JSON.parse(livePropsValue.replace(/&quot;/g, '"'));

    // Extract multiple attributes
    const token = decodedValue.marketplace_columns?._token || null;
    const csrfToken = $('div[data-live-csrf-value]').eq(0).attr('data-live-csrf-value') || null;
    const baggageValue = $('meta[name="baggage"]').attr('content') || '';
    const sentryTraceValue = $('meta[name="sentry-trace"]').attr('content') || null;
    const checksum = decodedValue['@checksum'] || null;
    const attributes = decodedValue['@attributes'] || null;

    const parseAndReorderBaggage = (baggage: string): string => {
        const baggageEntries = baggage.split(',').map(entry => entry.trim());

        const order = [
            'sentry-environment',
            'sentry-release',
            'sentry-public_key',
            'sentry-trace_id',
            'sentry-sample_rate',
            'sentry-sampled'
        ];

        // Convert to an object for easy manipulation
        const baggageMap: { [key: string]: string } = {};
        baggageEntries.forEach(entry => {
            const [key, value] = entry.split('=');
            if (key && value) {
                baggageMap[key] = value;
            }
        });

        // Reconstruct baggage string in the desired order
        return order
            .filter(key => baggageMap[key]) // Only include existing keys
            .map(key => `${key}=${baggageMap[key]}`)
            .join(',');
    };

    // Usage inside fetchTokenFromRedirectedURL
    const reorderedBaggage = parseAndReorderBaggage(baggageValue);

    // Extract and structure children elements dynamically
    const children: { [key: string]: { fingerprint: string; tag: string } } = {};
    $('div[id^="live-"]').each((_, element) => {
        const id = $(element).attr('id');
        if (id) {
            children[id] = {
                fingerprint: "", // If there's a specific fingerprint, extract it
                tag: $(element).prop("tagName")?.toLowerCase() || ""
            };
        }
    });

    if (!token || !csrfToken || !baggageValue || !sentryTraceValue || !checksum || !attributes) {
        console.error("❌ Missing required values:");
        console.error({
            token,
            csrfToken,
            baggage : reorderedBaggage,
            sentryTraceValue,
            checksum,
            attributes
        });
    }

    // Return all extracted attributes
    return {
        token,
        csrfToken,
        COOKIE: cookie,
        baggage : reorderedBaggage,
        sentryTraceValue,
        checksum,
        attributes,
        children
    };
};
