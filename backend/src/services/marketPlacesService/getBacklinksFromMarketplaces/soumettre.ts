
import { Payload } from "payload";
import { getCookieAndXCsrfTokenFromSoumettre } from "../getTokensOrCookiesFromMarketplaces/soumettre.ts";
import { getAllDataFromSoumettre } from "../getAllDataFromMarketplaces/soumettre.ts";
// import { getAllDataFromSoumettre } from "../getAllDataFromMarketplaces/Soumettre.ts";



export const getBacklinksDataFromSoumettre = async(payload : Payload) => {

    try{
        const cookie = await getCookieAndXCsrfTokenFromSoumettre();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        const all = await getAllDataFromSoumettre(cookie, payload);
        return all;

    }catch(error){
        if (error instanceof Error) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('Error fetching data:', error);
        }

        return "";
    }

}