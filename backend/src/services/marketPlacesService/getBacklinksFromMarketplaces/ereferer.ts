import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getAllDataFromEreferer } from "../getAllDataFromMarketplaces/ereferer.ts";
import { getCookieFromEreferer } from "../getTokensOrCookiesFromMarketplaces/ereferer.ts";


export const getBacklinksDataFromEreferer = async() => {

    try{
        const cookie = await getCookieFromEreferer();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        const allData = await getAllDataFromEreferer(cookie);

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