import { GET_BACKLINK_FROM_BOOSTERLINK_URL } from "@/global/marketplaceUrls";
import { fetchDataFromBoosterlink } from "../fetchDataFromMarketplaces/boostlink";
import { getCookieFromBoosterlink } from "../getTokensOrCookiesFromMarketplaces/boosterlink";
export const getBacklinksDataFromBoosterlink = async() => {

    try{
        const cookie = await getCookieFromBoosterlink();

        console.log("Received Cookie from Mistergoodlink : ", cookie);

        if(!cookie){
            throw new Error("API cookie is missing");
        }
    
        //Fetch data from all pages
        const allData = await fetchDataFromBoosterlink(GET_BACKLINK_FROM_BOOSTERLINK_URL, cookie);
    
        return allData;
        
    }catch(error){
        if (error instanceof Error) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('Error fetching data:', error);
        }
        
        return "";
    }

    
}