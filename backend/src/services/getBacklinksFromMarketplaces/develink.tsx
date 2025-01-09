import { GET_BACKLINK_FROM_DEVELINK_URL } from "@/global/marketplaceUrls";
import { fetchDataFromDevelink } from "../fetchDataFromMarketplaces/develink";
import { getCookieFromDevelink } from "../getTokensOrCookiesFromMarketplaces/develink";
import { getAllDataFromDevelink } from "../getAllDataFromMarketplaces/develink";

export const getBacklinksDataFromDevelink = async() => {

    try{
        const cookie = await getCookieFromDevelink();

        console.log("Received Cookie from Develink : ", cookie);

        if(!cookie){
            throw new Error("API cookie is missing");
        }
    
        //Fetch data from all pages
        const allData = await getAllDataFromDevelink(cookie);
    
        console.log('Total data receive : ', allData.length);
    
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