import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getAllDataFromDevelink } from "../getAllDataFromMarketplaces/develink.ts";
import { getCookieFromDevelink } from "../getTokensOrCookiesFromMarketplaces/develink.ts";

export const getBacklinksDataFromDevelink = async() => {

    try{
        const cookie = await getCookieFromDevelink();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        const allData = await getAllDataFromDevelink(cookie);

        console.log('Total data receive : ', allData.length);

        return allData;
    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Develink");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}