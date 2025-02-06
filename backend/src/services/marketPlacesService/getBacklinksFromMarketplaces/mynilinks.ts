
import { Payload } from "payload";
import { getCookieFromMynilinks } from "../getTokensOrCookiesFromMarketplaces/mynilinks.ts";
import { GET_BACKLINK_FROM_MYNILINKS_URL } from "@/globals/globalURLs.ts";
import { fetchDataFromMynilinks } from "../fetchDataFromMarketplaces/mynilinks.ts";
import { getAllDataFromMynilinks } from "../getAllDataFromMarketplaces/mynilinks.ts";


export const getBacklinksDataFromMynilinks = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromMynilinks();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        await getAllDataFromMynilinks(cookie, payload);

    }catch(error){
        if (error instanceof Error) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('Error fetching data:', error);
        }

        return "";
    }

}