import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { Payload } from "payload";
import { getTokenForLemmilink } from "../getTokensOrCookiesFromMarketplaces/lemmilink.ts";
import { getAllDataFromLemmilink } from "../getAllDataFromMarketplaces/lemmilink.ts";


// Function to process URLs in batches with p-limit
export const getBacklinksDataFromLemmilink = async (payload : Payload) => {

    try{
        const TokenAndUserId = await getTokenForLemmilink();

        if (!TokenAndUserId) {
        throw new Error("API token is missing");
        }

        const allData = await getAllDataFromLemmilink(TokenAndUserId, payload);

        return allData;

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Lemmilink");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

};