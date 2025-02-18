import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";

// Define the type for the response structure
interface LinkbrokerResponse {
    data: {
        DOMAIN?: string; // The domain name
        TF? : number;
        RD? : number;
        PRICE? : number;
        CATEGORY? : string;
    }[];
}


export const getFormDataFromLinkbroker = async (response: LinkbrokerResponse): Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
    try {
        // Ensure response is valid and contains currentPageResults array
        if (!response || !Array.isArray(response.data)) {
            throw new Error("Invalid response data. Expected an array in 'currentPageResults'.");
        }

        const formattedLinkbrokerData: FetchedBackLinkDataFromMarketplace[] = response.data.map((result) => {

            // Process domain to remove "www." and "https://"
            const rawDomain = result.DOMAIN || "Unknown";
            const formattedDomain = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, ""); // Remove "http://", "https://", and "www."

            return {
                domain: formattedDomain, // Use formatted domain
                tf: result.TF || 0, // Get trustFlow, or default to 0 if not available
                rd: result.RD || 0, // Get refDomain, or default to 0 if not available
                ttf : result.CATEGORY || '',
                price: result.PRICE ? Math.round(result.PRICE) : 0, // Get price from the article or default to 0
            };
        });

        return formattedLinkbrokerData;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Linkbroker");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
