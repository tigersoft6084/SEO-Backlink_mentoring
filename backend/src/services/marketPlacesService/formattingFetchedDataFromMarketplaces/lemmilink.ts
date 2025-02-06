import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";
import { normalizeDomain } from "@/utils/domainUtils.ts";

// Define the type for the response structure
interface LemmilinkResponse {
    sites: {
        url?: string; // The domain name
        PrixPublic? : number;
        RD? : number;
        TF? : number;
        CF? : number;
        TTF? : string;
        language? : string;
    }[];
}


export const getFormDataFromLemmilink = async (response: LemmilinkResponse): Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
    try {
        // Ensure response is valid and contains sites array
        if (!response || !Array.isArray(response.sites)) {
            throw new Error("Invalid response data. Expected an array in 'sites'.");
        }

        const formattedLemmilinkData: FetchedBackLinkDataFromMarketplace[] = response.sites.map((result) => {

            // Process domain to remove "www." and "https://"
            const rawDomain = result.url || "Unknown";
            const formattedDomain = normalizeDomain(rawDomain)          // Remove "http://", "https://", and "www."

            return {
                domain: formattedDomain, // Use formatted domain
                tf: result.TF || 0,
                cf: result.CF || 0,
                rd: result.RD || 0,
                ttf : result.TTF || '',
                price: parseInt(result.PrixPublic?.toString() || "0"),
            };
        });

        return formattedLemmilinkData;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Lemmilink");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
