import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";

interface PrensalinkResponse {
    newspapers?: {
        url?: string;
        metrics?: {
            tf: number;
            cf: number;
            dr: number;
        };
    }[];
    price?: number;
}

export const getFormDataFromPrensalink = (response: PrensalinkResponse[]): FetchedBackLinkDataFromMarketplace[] | Response => {
    try {
        if (!response) {
        console.error("Invalid response data:",);
        throw new Error("Invalid response data. Expected an array within the first item.");
        }

        const allData: FetchedBackLinkDataFromMarketplace[] = [];

        response.forEach((item) => {
            if (item.newspapers && Array.isArray(item.newspapers) && item.newspapers.length > 0) {
                const newspaper = item.newspapers[0];
                const rawDomain = newspaper.url || "Unknown";
                const formattedDomain = rawDomain
                    .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
                    .replace(/\/$/, ""); // Remove trailing slash

                allData.push({
                    domain: formattedDomain,
                    tf: newspaper.metrics?.tf || 0,
                    cf: newspaper.metrics?.cf || 0,
                    rd: newspaper.metrics?.dr || 0,
                    price: item.price || 0,
                });
            } else {
                console.warn("No newspapers found in item:", item);
            }
        });

        return allData;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Paperclub");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
