import { GET_BACKLINK_FROM_BOOSTERLINK_URL } from "@/globals/globalURLs.ts";
import { fetchDataFromBoosterlink } from "../fetchDataFromMarketplaces/boosterlink.ts";
import { getCookieFromBoosterlink } from "../getTokensOrCookiesFromMarketplaces/boosterlink.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { Payload } from "payload";
import { MARKETPLACE_NAME_BOOSTERLINK } from '../../../globals/strings.ts';

export const getBacklinksDataFromBoosterlink = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromBoosterlink();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        const seenDomains = new Set<string>();

        //Fetch data from all pages
        const allData = await fetchDataFromBoosterlink(GET_BACKLINK_FROM_BOOSTERLINK_URL, cookie);


        if (allData && Array.isArray(allData)) {
            for (const item of allData) {
                if (!seenDomains.has(item.domain)) {
                    seenDomains.add(item.domain); // Track processed domain
                    await uploadToDatabase(payload, item, MARKETPLACE_NAME_BOOSTERLINK); // Upload to database
                }
            }
        } else {
            console.warn(`No data fetched for page MARKETPLACE_NAME_BOOSTERLINK`);
        }

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Boosterlink");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

}