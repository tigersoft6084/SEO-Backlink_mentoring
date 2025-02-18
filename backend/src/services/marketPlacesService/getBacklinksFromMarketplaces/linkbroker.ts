import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { Payload } from "payload";
import { getTokenForLinkbroker } from "../getTokensOrCookiesFromMarketplaces/linkbroker.ts";
import { getAllDataFromLinkbroker } from "../getAllDataFromMarketplaces/linkbroker.ts";


// Function to process URLs in batches with p-limit
export const getBacklinksDataFromLinkbroker = async (payload : Payload) => {

    try{
        const Token = await getTokenForLinkbroker();

        if (!Token) {
            throw new Error("API token is missing");
        }

        await getAllDataFromLinkbroker(Token, payload);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Linkbroker");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

};