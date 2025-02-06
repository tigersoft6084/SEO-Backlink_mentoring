import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";
import { normalizeDomain } from "@/utils/domainUtils.ts";
import * as cheerio from "cheerio";

export const getFormDataFromGrowwer = async (response: string[]) : Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
    try {
        if (!response || !Array.isArray(response) || response.length === 0) {
            throw new Error("Invalid response data. Expected a non-empty array.");
        }

        // Convert the array into a single HTML string
        const htmlString = response.join("\n");

        const $ = cheerio.load(htmlString);
        const extractedData: FetchedBackLinkDataFromMarketplace[] = [];

        // Select all media result list items
        $("li.js-result").each((_, element) => {
            const url = $(element).find("h4 a").text().trim() || null;
            const priceText = $(element).find(".whitespace-nowrap.text-lg").text().trim();
            const price = priceText ? parseInt(priceText.replace(/[^\d.]/g, "")) : 0;
            const language = $(element)
                .find("span.font-bold.pr-1.mr-1.border-r.border-gray-300")
                .parent()
                .contents()
                .last()
                .text()
                .trim() || "";
            // Extract TTF (take the first relevant one)
            const ttfRaw = $(element).find(".border.border-gray-300.rounded").text().trim();
            const ttfList = ttfRaw.split("\n").map((item) => item.trim()).filter((item) => item.length > 0);
            const ttf = ttfList.length > 1 ? ttfList[1] : ttfList[0] || ""; // Pick second if available, otherwise first


            if (url) {
                extractedData.push({
                    domain: normalizeDomain(url),
                    price,
                    language,
                    ttf,
                });
            }
        });

        if (extractedData.length === 0) {
            console.warn("No data extracted from the response.");
        }

        return extractedData; // Now returns all extracted results instead of just one
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Growwer");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        })
    }
};
