import { Payload } from "payload";

import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { MARKETPLACE_NAME_Linkatomic } from "@/globals/strings.ts";
import { getCookieFromLinkatomic } from "../getTokensOrCookiesFromMarketplaces/linkatomic.ts";
import { getAllDataFromLinkatomic } from "../getAllDataFromMarketplaces/linkatomic.ts";

export const getBacklinksDataFromLinkatomic = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromLinkatomic();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        await getAllDataFromLinkatomic(cookie, payload);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_Linkatomic}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}