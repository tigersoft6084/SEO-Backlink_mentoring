import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getAllDataFromDevelink } from "../getAllDataFromMarketplaces/develink.ts";
import { getCookieFromDevelink } from "../getTokensOrCookiesFromMarketplaces/develink.ts";
import { Payload } from "payload";

export const getBacklinksDataFromDevelink = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromDevelink();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        await getAllDataFromDevelink(cookie, payload);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Develink");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}