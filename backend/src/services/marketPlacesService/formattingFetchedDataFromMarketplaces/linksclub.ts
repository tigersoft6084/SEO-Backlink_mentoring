import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";
import * as cheerio from "cheerio";

export const getFormDataFromLinksclub = async (response: string): Promise<FetchedBackLinkDataFromMarketplace[]> => {
    try {
        // Ensure response is valid and contains HTML
        if (!response || typeof response !== "string") {
            throw new Error("Invalid response data. Expected a string.");
        }

        // Load the HTML content into cheerio
        const $ = cheerio.load(response);

        // Find the script block containing websitesData
        const websitesData : FetchedBackLinkDataFromMarketplace[] = [];

        $("tbody tr").each((_, row) => {
            let domain = $(row).find("td[id^='show-']").text().trim();
            domain = domain.replace(/\s+/g, " ").split(" ")[0].trim(); // Remove extra spaces & keep only domain name

            const tf = $(row).find(".td_tf").text().trim();
            const cf = $(row).find(".td_cf").text().trim();
            const rd = $(row).find(".td_rd").text().trim();
            const price = $(row).find("td:contains('€')").text().trim(); // Get the price column

            if (domain) {
                websitesData.push({ domain : domain, tf : parseInt(tf), cf : parseInt(cf), rd : parseInt(rd), price : parseInt(price) });
            }
        });

        if (websitesData.length === 0) {
            throw new Error("No websitesData found in the response For Linksclub.");
        }

        return websitesData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Linksclub");
        console.log(errorDetails, status);
        throw errorDetails;
    }
};
