import { GET_BACKLINK_FROM_LINKAVISTA_URL } from "@/globals/marketplaceUrls.ts";
import { fetchDataFromLinkavistar } from "../fetchDataFromMarketplaces/linkavista.ts";
import { getCookieFromLinkaVista } from "../getTokensOrCookiesFromMarketplaces/linkavista.ts";
import { Payload } from "payload";


export const getBacklinksDataFromLinkaVista = async(payload : Payload) => {

    try{
        const cookie = await getCookieFromLinkaVista();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        const allData = await fetchDataFromLinkavistar(GET_BACKLINK_FROM_LINKAVISTA_URL, cookie, payload);

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