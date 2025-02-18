import { Payload } from "payload";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { GET_BACKLINK_FROM_LINKSCLUB_URL } from "@/globals/globalURLs.ts";
import { MARKETPLACE_NAME_LINKSCLUB } from "@/globals/strings.ts";
import { fetchDataFromLinksclub } from "../fetchDataFromMarketplaces/Linksclub.ts";

export const getAllDataFromLinksclub = async (cookie : string, payload : Payload) : Promise<void> => {

    if(!cookie){
        throw new Error('API cookie is missing');
    }

    const seenDomains = new Set<string>();

    try{

        const data = await fetchDataFromLinksclub(GET_BACKLINK_FROM_LINKSCLUB_URL,  cookie);

        if (data && Array.isArray(data)) {
            for (const item of data) {
                if (!seenDomains.has(item.domain)) {
                    seenDomains.add(item.domain); // Track processed domain
                    await uploadToDatabase(payload, item, MARKETPLACE_NAME_LINKSCLUB); // Upload to database
                }
            }
        } else {
            console.warn(`No data fetched for Linksclub`);
        }
    }catch(error){
        console.error(`Error fetching data for Linksclub:`, error instanceof Error ? error.message : error);
    }

    console.log("Linksclub data processing complete.");
}