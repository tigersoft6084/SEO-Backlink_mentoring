import { FormattedSeojungleData } from "@/types/backlink.ts";

export const getFormDataFromSeojungle = async (response: any): Promise<any> => {

    try {
        // Ensure response is valid and contains currentPageResults array
        if (!response) {
        throw new Error("No response data.");
        }

        const data = response.data.data.support || [];
        return data.map((item: FormattedSeojungleData) => {

            // Process domain to remove "www." and "https://"
            const rawDomain = item.url || "Unknown";
            const formattedDomain = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, ""); // Remove "http://", "https://", and "www."

            const price = item.products?.[0]?.margedPrice || 0;

            return {
                domain: formattedDomain || "",
                tf: item.trustFlow || 0,
                cf: item.citationFlow || 0,
                rd: item.referringDomains || 0,
                price,
            };
        });

    } catch (error) {
        console.error("Error processing the page:", error);
        return null; // Return null in case of an error
    }
};
