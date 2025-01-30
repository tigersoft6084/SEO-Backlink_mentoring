import { Payload } from "payload";
import { getCookieFromPublisuites } from "../getTokensOrCookiesFromMarketplaces/publisuites.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { GET_BACKLINK_FROM_PUBLISUITES_URL } from "@/globals/globalURLs.ts";
import { getAlldatafromPublisuites } from "../getAllDataFromMarketplaces/publisuites.ts";
import { MARKETPLACE_NAME_PUBLISUITES } from "@/globals/strings.ts";

export const getBakclinksDataFromPublisuites = async(payload : Payload) => {

    try{

        const cookie = await getCookieFromPublisuites();

        if(!cookie){
            throw new Error('API cookie is missing');
        }

        await getAlldatafromPublisuites(GET_BACKLINK_FROM_PUBLISUITES_URL, cookie, payload);

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, `Error occured from getting backlinks from ${MARKETPLACE_NAME_PUBLISUITES}`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}