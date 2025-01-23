import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";
import * as cheerio from "cheerio";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { MARKETPLACE_NAME_LINKAVISTAR } from "@/globals/strings.ts";
import { Payload } from "payload";

interface WebsiteData {
    domain: string;
    tf: number;
    cf: number;
    rd: number;
    credit: number;
    ttf1 : string | '';
    language : string | '';
}

export const getFormDataFromLinkavistar = async (response: string, payload : Payload): Promise<void> => {
    try {
        // Ensure response is valid and contains HTML
        if (!response || typeof response !== "string") {
            throw new Error("Invalid response data. Expected a string.");
        }

        // Load the HTML content into cheerio
        const $ = cheerio.load(response);

        // Find the script block containing websitesData
        let websitesData: WebsiteData[] = [];

        $('script').each((index, element) => {
            const scriptContent = $(element).html() || '';
            if (scriptContent.includes('let websitesData =')) {
                try{
                    // Extract the JSON part of websitesData
                    const match = scriptContent.match(/let websitesData\s*=\s*(\[[\s\S]*?\]);/);
                    if (match && match[1]) {
                        websitesData = JSON.parse(match[1]) as WebsiteData[];
                    }
                }catch(error){
                    const { errorDetails } = ErrorHandler.handle(error, "Failed to parse websitesData JSON from Linkavistar.");
                    throw errorDetails.context;
                }
                return false;
            }
        });

        if (websitesData.length === 0) {
            throw new Error("No websitesData found in the response For Linkavistar.");
        }

        const seenDomains = new Set<string>(); // Track processed domains to avoid duplicates

        // Process and format the extracted data
        const formattedResult: FetchedBackLinkDataFromMarketplace[] = websitesData.map((website) => {

            const rawDomain = website.domain || "Unknown";
            const formattedDomain = rawDomain
                .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."

            // Return the formatted result
            return {
                domain: formattedDomain,
                tf: website.tf || 0,
                cf: website.cf || 0,
                rd: website.rd || 0,
                price: (website.credit || 0) / 100,
                ttf : website.ttf1 || '',
                language : website.language || ''
            };
        });

        if(Array.isArray(formattedResult) && formattedResult.length > 0){
            for(const item of formattedResult){
                if(!seenDomains.has(item.domain)){
                    seenDomains.add(item.domain);
                    await uploadToDatabase(payload, item, MARKETPLACE_NAME_LINKAVISTAR);
                }
            }
            console.log(`Processed page Linkavistar, items: ${formattedResult.length}`);
        }else{
            console.warn(`No data found on page Linkavistar`);
        }
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Linkavistar");
        console.log(errorDetails, status);
        return ;
    }
};
