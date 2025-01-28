import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";

interface SeojungleResponse {
    url?: string;
    trustFlow?: number;
    citationFlow?: number;
    referringDomains?: number;
    products?: Array<{
        margedPrice?: number;
    }>;
    totalBacklinks : number;
}

export const getFormDataFromSeojungle = async (
    response: SeojungleResponse[]
): Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {

    try {
        // Ensure response is valid
        if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response data. Expected an array.");
        }

        // Process the response and format it into the desired structure
        const formattedData: FetchedBackLinkDataFromMarketplace[] = response.map(
            (item) => {
                // Ensure URL is properly formatted
                const rawDomain = item.url || "Unknown";
                const formattedDomain = rawDomain
                .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
                .replace(/\/$/, ""); // Remove trailing slash

                // Extract price from products array
                const price = item.products?.[0]?.margedPrice || 0;

                return {
                    domain: formattedDomain,
                    tf: item.trustFlow || 0,
                    cf: item.citationFlow || 0,
                    rd: item.referringDomains || 0,
                    backlinks : item.totalBacklinks || 0,
                    price,
                };
            }
        );

        return formattedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(
            error,
            "Error Formatting Data For Seojungle"
        );

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
