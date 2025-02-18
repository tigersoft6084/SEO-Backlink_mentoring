import { Payload } from "payload";

import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getCookieFromLinksclub } from "../getTokensOrCookiesFromMarketplaces/linksclub.ts";
import { MARKETPLACE_NAME_LINKSCLUB } from "@/globals/strings.ts";
import { getAllDataFromLinksclub } from "../getAllDataFromMarketplaces/Linksclub.ts";

export const getBacklinksDataFromLinksclub = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromLinksclub();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        const data = await getAllDataFromLinksclub(cookie, payload);
        return data;

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_LINKSCLUB}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}