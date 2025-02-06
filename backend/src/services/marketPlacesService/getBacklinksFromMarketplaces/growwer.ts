import { Payload } from "payload";

import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getCookieFromGrowwer } from "../getTokensOrCookiesFromMarketplaces/growwer.ts";
import { MARKETPLACE_NAME_GROWWER } from "@/globals/strings.ts";
import { getAllDataFromGrowwer } from "../getAllDataFromMarketplaces/growwer.ts";


export const getBacklinksDataFromGrowwer = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromGrowwer();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //await getAllDataFromGrowwer(cookie, payload);
        const alldata = await getAllDataFromGrowwer(cookie, payload)

        return alldata;
    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_GROWWER}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}