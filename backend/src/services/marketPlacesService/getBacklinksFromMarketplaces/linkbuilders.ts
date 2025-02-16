import { ErrorHandler } from "@/handlers/errorHandler.ts";

import { Payload } from "payload";
import { getTokenForLinkBuilders } from "../getTokensOrCookiesFromMarketplaces/linkbuilders.ts";
import { getAllDataFromLinkbuilders } from "../getAllDataFromMarketplaces/linkbuilders.ts";


// Function to process URLs in batches with p-limit
export const getBacklinksDataFromLinkbuilders = async (payload : Payload) => {

    try{
        const Token = await getTokenForLinkBuilders();

        if (!Token) {
        throw new Error("API token is missing");
        }

        const allData = await getAllDataFromLinkbuilders(Token, payload);

        return allData;

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Linkbuilders");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

};