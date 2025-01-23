import { Payload } from "payload";
import { getAllDataFromMistergoodlink } from "../getAllDataFromMarketplaces/mistergoodlink.ts";
import { getCookieFromMistergoodlink } from "../getTokensOrCookiesFromMarketplaces/mistergoodlink.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { MARKETPLACE_NAME_MISTERGOODLINK } from "@/globals/strings.ts";


export const getBacklinksDataFromMistergoodlink = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromMistergoodlink();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        await getAllDataFromMistergoodlink(cookie, payload);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_MISTERGOODLINK}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}