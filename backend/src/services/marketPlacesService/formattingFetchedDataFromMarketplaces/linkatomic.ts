import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";
import * as cheerio from "cheerio";

export const getFormDataFromLinkatomic = async (
    response: string,
    cookie: string
) : Promise<FetchedBackLinkDataFromMarketplace[]> => {
    try {

        if (!response || typeof response !== "string") {
            throw new Error("Invalid response data. Expected a string.");
        }

        const $ = cheerio.load(response);
        const result : FetchedBackLinkDataFromMarketplace[] = [];
        const processedDomains = new Set<string>();

        const tableBody = $("table tbody");

        if (tableBody.length === 0) {
            console.error("No table found in the response");
            return [];
        }

        const rows = tableBody.find("tr").toArray();

        for (const row of rows) {

            const siteId = $(row).find("a.modal-site-info").attr("data-site-id") || "";

            // Skip if siteId is already processed
            if (!siteId || processedDomains.has(siteId)) {
                continue;
            }

            processedDomains.add(siteId);

            // Fetch detailed information for the siteId
            const infoResponse = await fetch(
                `https://app.linkatomic.com/dashboard/sites/${siteId}/info?links=0`,
                {
                    method: "GET",
                    headers: {
                        Cookie: cookie,
                        'X-Requested-With' : 'XMLHttpRequest'
                    },
                }
            );

            // Parse the fetched HTML response
            const infoHtml = await infoResponse.text();
            const $$ = cheerio.load(infoHtml);

            // Extract data from the modal
            const url = $$('#modal_site_info_name').attr('href') || '';
            let formattedDomain;
            if(url.startsWith('http')){
                formattedDomain = url.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");

                if(processedDomains.has(formattedDomain)){
                    continue;
                }
            }


            const tf = $$('img[alt="Majestic"]').closest('li').text().match(/TF\s*:\s*(\d+)/)?.[1] || '0';
            const price = $$('#modal_site_info_precio').text().trim() || '0';

            // Push the extracted data into the result array
            if(formattedDomain && parseInt(price) > 0){
                result.push({
                    domain : formattedDomain,
                    price : parseInt(price),
                    tf : parseInt(tf) || 0,
                });
                processedDomains.add(formattedDomain);
            }
        }

        return result;
    } catch (error) {
        console.error("Error Formatting Data For Develink:", error);
        throw error; // Re-throw error for consistent handling
    }
};
