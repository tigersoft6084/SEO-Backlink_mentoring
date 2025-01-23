import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getAllDataFromEreferer } from "../getAllDataFromMarketplaces/ereferer.ts";
import { getCookieFromEreferer } from "../getTokensOrCookiesFromMarketplaces/ereferer.ts";
import { Payload } from "payload";
import { MARKETPLACE_NAME_EREFERER } from "@/globals/strings.ts";


export const getBacklinksDataFromEreferer = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromEreferer();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        await getAllDataFromEreferer(cookie, payload);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_EREFERER}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}