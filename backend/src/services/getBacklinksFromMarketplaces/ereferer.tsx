import { getAllDataFromEreferer } from "../getAllDataFromMarketplaces/ereferer";
import { getCookieFromEreferer } from "../getTokensOrCookiesFromMarketplaces/ereferer"

export const getBacklinksDataFromEreferer = async() => {

    try{
        const cookie = await getCookieFromEreferer();

        console.log("Received Cookie from Mistergoodlink : ", cookie);

        if(!cookie){
            throw new Error("API cookie is missing");
        }
    
        //Fetch data from all pages
        const allData = await getAllDataFromEreferer(cookie);
    
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