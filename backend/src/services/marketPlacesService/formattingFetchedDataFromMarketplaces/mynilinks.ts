import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";
import { normalizeDomain } from "@/utils/domainUtils.ts";
import * as cheerio from 'cheerio';

export const getFormDataFromMynilinks = async (response : string) : Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {

    try{
        // Ensure response is valid and contains HTML
        if (!response || typeof response !== "string") {
            throw new Error("Invalid response data. Expected a string.");
        }

        const $ = cheerio.load(response);

        const data : FetchedBackLinkDataFromMarketplace[] = []; // Array to store extracted data

        $('.col-md-4.col-sm-6').each((index, element) => {
            const url = $(element).find('.card-text').attr('href');

            const domain = url ? normalizeDomain(url) : 'N/A';

            const priceText = $(element).find('[data-netlinking-id]').text().trim();
            const priceMatch = priceText.match(/(\d+,\d+)€/);
            const price = priceMatch ? priceMatch[1] : 'N/A';

            // Get modal ID from "data-netlinking-id"
            const netlinkingId = $(element).find('[data-netlinking-id]').attr('data-netlinking-id');
            const modalSelector = `#viewModal${netlinkingId}`;
            const modal = $(modalSelector);

            // Extract TF, CF, TTF using exact <th> match
            const tf = modal.find('th').filter((i, el) => $(el).text().trim() === "TF").next('td').text().trim() || 'N/A';
            const cf = modal.find('th').filter((i, el) => $(el).text().trim() === "CF").next('td').text().trim() || 'N/A';
            const ttf = modal.find('th').filter((i, el) => $(el).text().trim() === "TTF").next('td').text().trim() || 'N/A';

            if(domain){
                data.push({ domain : domain, tf : parseInt(tf), cf : parseInt(cf), price : parseInt(price), ttf });
            }

        });

return data;

    }catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Linkavistar");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}