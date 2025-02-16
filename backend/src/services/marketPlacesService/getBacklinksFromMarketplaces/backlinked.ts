import { Payload } from "payload";

import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getCookieFromBacklinked } from "../getTokensOrCookiesFromMarketplaces/backlinked.ts";
import { getAllDataFromBacklinked } from "../getAllDataFromMarketplaces/backlinked.ts";
import { MARKETPLACE_NAME_BACKLINKED } from "@/globals/strings.ts";

export const getBacklinksDataFromBacklinked = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromBacklinked();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        await getAllDataFromBacklinked(cookie, payload);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_BACKLINKED}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}