import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";

// Define the type for the response structure
interface BacklinkedResponse {
    data: {
        domain? : {
            domain : string;
        };
        price?: number;
        majestic_citation_flow : number;
        majestic_trust_flow : number;
    }[];
}


export const getFormDataFromBacklinked = async (response: BacklinkedResponse): Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
    try {
        // Ensure response is valid and contains currentPageResults array
        if (!response || !Array.isArray(response.data)) {
        throw new Error("Invalid response data. Expected an array in 'currentPageResults'.");
        }

        const formattedBacklinkedData: FetchedBackLinkDataFromMarketplace[] = response.data.map((result) => {

            // Process domain to remove "www." and "https://"
            const rawDomain = result.domain?.domain || "Unknown";
            const formattedDomain = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, ""); // Remove "http://", "https://", and "www."

            return {
                domain: formattedDomain, // Use formatted domain
                tf: result.majestic_trust_flow || 0, // Get trustFlow, or default to 0 if not available
                cf: result.majestic_citation_flow || 0, // Get citationFlow, or default to 0 if not available
                price: result.price || 0, // Get price from the article or default to 0
            };
        });

        return formattedBacklinkedData;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Backlinked");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
