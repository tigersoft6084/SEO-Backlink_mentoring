import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";

interface LinkbuildersResponse {
    data: {
        domain?: string; // The domain name
        Refdomains? : number;
        language? : string;
        Backlinks? : number;
        categories? : string[];
        pricesInEUR? : {
            internalPrices? : {
                priceArticlePermanent? : number;
            }
        }
    }[];
}

export const getFormDataFromLinkbuilders = async (response : LinkbuildersResponse) : Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {

    try{

        if(!response || !Array.isArray(response.data)){
            throw new Error("Invalid response data. Expected an array in 'currentPageResults'.");
        }

        const formattedLinkbuildersData : FetchedBackLinkDataFromMarketplace[] = response.data.map((result) => {

            const rawDomain = result.domain || 'Unknown';
            const formattedDomain = rawDomain
                .replace(/^(https?:\/\/)?(www\.)?/, "")
                .replace(/\/$/, "");; // Remove "http://", "https://", and "www."

            return{
                domain : formattedDomain,
                rd : parseInt(result.Refdomains?.toString() || '0', 10),
                language : result.language || '',
                backlinks : result.Backlinks || 0,
                ttf : result.categories?.[0] || '',
                price : parseInt(result.pricesInEUR?.internalPrices?.priceArticlePermanent?.toString() || "0", 10)
            }
        })

        return formattedLinkbuildersData;


    }catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Paperclub");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}