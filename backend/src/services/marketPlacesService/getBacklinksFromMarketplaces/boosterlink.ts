import { GET_BACKLINK_FROM_BOOSTERLINK_URL } from "@/global/marketplaceUrls.ts";
import { fetchDataFromBoosterlink } from "../fetchDataFromMarketplaces/boostlink.ts";
import { getCookieFromBoosterlink } from "../getTokensOrCookiesFromMarketplaces/boosterlink.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
export const getBacklinksDataFromBoosterlink = async() => {

    try{
        const cookie = await getCookieFromBoosterlink();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        const allData = await fetchDataFromBoosterlink(GET_BACKLINK_FROM_BOOSTERLINK_URL, cookie);

        return allData;

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Not received Cookie : ");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}