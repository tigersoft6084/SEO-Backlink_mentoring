import { getCookieFromMistergoodlink } from "../getTokensOrCookiesFromMarketplaces/mistergoodlink"

export const getBacklinksDataFromMistergoodlink = async() => {

    try{
        const cookie = await getCookieFromMistergoodlink();

        if(!cookie){
            throw new Error("API cookie is missing");
        }

        return cookie;

    }catch(error){
        if (error instanceof Error) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('Error fetching data:', error);
        }
        
        return "";
    }
}