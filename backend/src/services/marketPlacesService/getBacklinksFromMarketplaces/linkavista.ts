import { GET_BACKLINK_FROM_LINKAVISTA_URL } from "@/global/marketplaceUrls.ts";
import { fetchDataFromLinkavistar } from "../fetchDataFromMarketplaces/linkavista.ts";
import { getCookieFromLinkaVista } from "../getTokensOrCookiesFromMarketplaces/linkavista.ts";


export const getBacklinksDataFromLinkaVista = async() => {

    try{
        const cookie = await getCookieFromLinkaVista();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        //Fetch data from all pages
        const allData = await fetchDataFromLinkavistar(GET_BACKLINK_FROM_LINKAVISTA_URL, cookie);

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