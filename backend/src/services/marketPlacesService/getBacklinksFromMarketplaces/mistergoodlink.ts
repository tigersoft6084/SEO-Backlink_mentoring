import { getAllDataFromMistergoodlink } from "../getAllDataFromMarketplaces/mistergoodlink.ts";
import { getCookieFromMistergoodlink } from "../getTokensOrCookiesFromMarketplaces/mistergoodlink.ts";


export const getBacklinksDataFromMistergoodlink = async() => {

    try{
        const cookie = await getCookieFromMistergoodlink();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        const allData = await getAllDataFromMistergoodlink(cookie);
    
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