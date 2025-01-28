import { FetchedBackLinkDataFromMarketplace } from '@/types/backlink.js';
import * as cheerio from 'cheerio';
export const getFormDataFromUnancor = async (response : string) : Promise<FetchedBackLinkDataFromMarketplace[]> => {

    try{

        if (!response || typeof response !== "string") {
            throw new Error("Invalid response data. Expected a string.");
        }

        const $ = cheerio.load(response);
        const result: FetchedBackLinkDataFromMarketplace[] = [];
        const processedDomains = new Set<string>();

        const tableBody = $("table tbody");

        if (tableBody.length === 0) {
            console.error("No table found in the response");
            return [];
        }

        // Define selectors for the table rows (adjust according to your HTML structure)
        const rows = $("tr"); // Adjust the selector to target the correct table rows

        // Iterate through the rows and extract the required data
        rows.each((index, row) => {
            const url = $(row).find("a").attr("href"); // URL from an anchor tag
            const tf = $(row)
                .find(".fi-table-cell-domain\\.metrics\\.majestic-t-f span")
                .text()
                .trim() || "N/A";
            const priceText = $(row)
                .find(".fi-table-cell-prices\\.sale-price .purchase-post-column a")
                .text()
                .trim() || "N/A";

            // Extract domain, parse price, and validate URL
            if (url) {
                const domainMatch = url.match(/https?:\/\/.*\/\?(https?:\/\/)?([^\/]+)/);
                let domain = domainMatch ? domainMatch[2] : undefined;

                // Remove 'www.' if it exists
                if (domain && domain.startsWith("www.")) {
                    domain = domain.replace(/^www\./, "");
                }

                if (domain && processedDomains.has(domain)) {
                    return;
                }

                const priceMatch = priceText.match(/(\d+)/); // Extract first number in price text
                const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;

                if (domain && price > 0) {
                    result.push({
                    domain: domain,
                    price: price,
                    tf: parseInt(tf, 10) || 0,
                    });
                    processedDomains.add(domain);
                }
            }
        });

        return result;

    }catch(error){

        console.error("Error Formatting Data For Develink:", error);
        throw error; // Re-throw error for consistent handling

    }
}