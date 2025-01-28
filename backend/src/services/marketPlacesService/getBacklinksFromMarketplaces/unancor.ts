import { Payload } from "payload";
import { getCookieAndCSRFTokenFromUnancor } from "../getTokensOrCookiesFromMarketplaces/unancor.ts";
import { GET_BACKLINK_FROM_UNANCOR_URL } from "@/globals/globalURLs.ts";
import { getAllDataFromUnancor } from "../getAllDataFromMarketplaces/unancor.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { MARKETPLACE_NAME_UNANCOR } from "@/globals/strings.ts";

export const getBacklinksDataFromUnancor = async(payload : Payload) => {

    try{

        const cookieAndCsrfToken = await getCookieAndCSRFTokenFromUnancor();

        if(!cookieAndCsrfToken){
            throw new Error('API cookie or CSRF token is missing');
        }

        await getAllDataFromUnancor(GET_BACKLINK_FROM_UNANCOR_URL, cookieAndCsrfToken, payload);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_UNANCOR}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}