import { MARKETPLACE_NAME_PUBLISUITES } from "@/globals/strings.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts"
import { PUBLISUITES_API_URL, PUBLISUITES_API_URL_POST } from "@/globals/globalURLs.ts";
import * as cheerio from 'cheerio';
import { ErrorHandler } from "@/handlers/errorHandler.ts";

export const getCookieFromPublisuites = async () : Promise<string | null> => {

    const credentials = await getCredentialsForMarketplaces();

    for(const credendtial of credentials){

        const hasPublisuitesTarget = credendtial.websiteTarget.some((target : { value : string}) => target.value === MARKETPLACE_NAME_PUBLISUITES);

        if(hasPublisuitesTarget){

            console.log(`Found Publisuites credentials for ${credendtial.email}`);

            if(credendtial.password){

                const cookie = await fetchCookieFromPublisuites_POST_login(credendtial.email, credendtial.password);

                return cookie;
            }
        }
    }

    return null;
}

const fetchCookieFromPublisuites_POST_login = async(email : string, password : string) : Promise<string | null> => {

    try{

        const getValidationData = await fetch_CSRF_TOKEN_From_GET_Login();

        if(!getValidationData){
            throw new Error('Failed to fetch CSRF token from Publisuites');
        }

        const formData = new URLSearchParams();

        // Add form data dynamically
        formData.append('email', email);
        formData.append('password', password);
        formData.append('recaptcha_response', '03AFcWeA6nM_umgHHJo2n5xLUZoFyVLqdUGcVmCDs2IDsi8_vOkElR5ZGudhnpg2b31PL_Dcm7qPDetdO...');
        formData.append('token', getValidationData);
        formData.append('z-BiAFIHStJd', '6ew0klqHxP');
        formData.append('oSWbQnHlwfzA', '81j4]nWuSU2qJ');
        formData.append('tfRFCQxIhKMyq', '6XiQ_J7vjwk0');
        formData.append('jRHwTOnf', 'KDPV97m');

        const response = await fetch(PUBLISUITES_API_URL_POST, {

            method : 'POST',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132 Safari/537.36',
                Accept: 'application/json, text/javascript, */*; q=0.01',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                host: 'www.publisuites.com',
                'X-Livewire' : ''
            },
            body : formData.toString(),
            redirect : 'manual',

        });

        if(!response.ok && response.status !== 302){
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch cookie from Linkatomic');
        }

        const setCookieHeaders = response.headers.get('set-cookie') || '';

        const PHPSESSID = setCookieHeaders.match(/PHPSESSID=[^;]+;/);
        const publisuitesauthadavertiser = setCookieHeaders.match(/publisuitesauthadavertiser=[^;]+;/);

        if (PHPSESSID && publisuitesauthadavertiser) {
            const extractedCookie = `${publisuitesauthadavertiser[0]} ${PHPSESSID[0]} bAqoEUQcVTDeB=6jGwExKLmtg; cnULhwmu=wLpRuzT%5Bn`.trim();

            return extractedCookie;
        } else {
            console.log("One or more required cookies not found.");
        }

        return '';

    }catch(error){
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Linkatomic : ");
        return errorDetails.context;
    }
}

const fetch_CSRF_TOKEN_From_GET_Login = async() : Promise<string | null> => {

    const response = await fetch(PUBLISUITES_API_URL, {method : 'GET'});

    if(!response.ok){
        console.error('Response body:', await response.text());
        throw new Error('Failed to fetch CSRF token from Publisuites');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const token = $('input[name="token"]').attr('value');

    if(!token){
        throw new Error('Failed to fetch CSRF token from Publisuites');
    }

    return token;
}