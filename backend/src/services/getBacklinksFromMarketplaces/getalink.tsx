import { getTokenForGetalink } from "../getTokensOrCookiesFromMarketplaces/getalink";
import { getAllDataFromGetalink } from "../getAllDataFromMarketplaces/getalink";

export const getBacklinksDataFromGetalink = async() => {

    try{
        const token = await getTokenForGetalink();

        console.log("Received token from Getalink : ", token);

        if(!token){
            throw new Error("API token is missing");
        }
    
        const allData = getAllDataFromGetalink(token);
    
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