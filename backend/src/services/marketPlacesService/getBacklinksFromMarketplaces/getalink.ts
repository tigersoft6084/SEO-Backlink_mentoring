import { Payload } from "payload";
import { getAllDataFromGetalink } from "../getAllDataFromMarketplaces/getalink.ts";
import { getTokenForGetalink } from "../getTokensOrCookiesFromMarketplaces/getalink.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { MARKETPLACE_NAME_GETALINK } from "@/globals/strings.ts";

export const getBacklinksDataFromGetalink = async(payload : Payload) => {

    try{
        const token = await getTokenForGetalink();

        if(!token){
            throw new Error("API token is missing");
        }

        const allData = getAllDataFromGetalink(token, payload);

        return allData;
    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_GETALINK}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}