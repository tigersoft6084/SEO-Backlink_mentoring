import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";
interface GetalinkResponse {
    data: {
        url: string;
        tf: number;
        cf: number;
        rd: number;
        price: { precio_usuario: number };
    }[];
}

export const getFormDataFromGetalink = async (response: string): Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
    // Ensure response is valid
    if (!response) {
        throw new Error("No response data");
    }

    try {
        // If `response` is a string, parse it
        const GetalinkResponse : GetalinkResponse = typeof response === "string" ? JSON.parse(response) : response;

        // Validate that the parsed response has a `data` property
        if (!GetalinkResponse.data || !Array.isArray(GetalinkResponse.data)) {
            throw new Error("Invalid response format: missing 'data' array");
        }

        // Extract relevant data
        const extractedData: FetchedBackLinkDataFromMarketplace[] = GetalinkResponse.data.map((item) => {
            let domain = "";

            if (item.url) {
                try {
                    // If the `url` contains a valid URL, extract the hostname
                    domain = new URL(item.url).hostname;
                } catch {
                    // If the `url` is not a valid URL, assume it is a domain name
                    domain = item.url;
                }
            }

            const formattedDomain = domain
                .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
                .replace(/\/$/, ""); // Remove trailing slash

            return {
                domain : formattedDomain || "unknown", // Use the processed domain or extracted hostname
                tf: item.tf || 0, // Default to 0 if tf is missing
                cf: item.cf || 0, // Default to 0 if cf is missing
                rd: item.rd || 0, // Default to 0 if rd is missing
                price: item.price?.precio_usuario || 0, // Default to 0 if price is missing
            };
        });

        return extractedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Getalink");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
