
import { Payload } from "payload";
import { getCookieFromPresswhizz } from "../getTokensOrCookiesFromMarketplaces/presswhizz.ts";
// import { getAllDataFromPresswhizz } from "../getAllDataFromMarketplaces/presswhizz.ts";



export const getBacklinksDataFromPresswhizz = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromPresswhizz() as { token: string; COOKIE: string; csrfToken: string; baggageValue: string; sentryTraceValue: string; checksum: string; attributes: { id: string; }; children: Record<string, { fingerprint: string; tag: string; }> } | string;

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        if (typeof cookie === 'string') {
            throw new Error("Invalid cookie format");
        }
        // await getAllDataFromPresswhizz(cookie, payload);

    }catch(error){
        if (error instanceof Error) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('Error fetching data:', error);
        }

        return "";
    }

}