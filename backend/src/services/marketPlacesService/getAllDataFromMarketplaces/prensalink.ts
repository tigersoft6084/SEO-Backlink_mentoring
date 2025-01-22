import { GET_BACKLINK_FROM_PRENSALINK_URLS } from "@/globals/marketplaceUrls.ts";
import pLimit from "p-limit";
import { fetchDataFromPrensalink } from "../fetchDataFromMarketplaces/prensalink.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";

export const getAllDataFromPrensalink = async (
    token: string
    ): Promise<FetchedBackLinkDataFromMarketplace[]> => {
    if (!token) {
        throw new Error("API token is missing");
    }

    const limit = pLimit(5); // Limit concurrent requests to 5
    const batchSize = 10; // Process 10 URLs in a batch
    const totalUrls = GET_BACKLINK_FROM_PRENSALINK_URLS.length;
    const allData: FetchedBackLinkDataFromMarketplace[] = []; // Explicitly type allData
    let processedUrls = 0;

    for (let i = 0; i < totalUrls; i += batchSize) {
        const batchUrls = GET_BACKLINK_FROM_PRENSALINK_URLS.slice(i, i + batchSize);

        console.log(`Processing batch from index ${i} to ${i + batchUrls.length}`);

        // Use Promise.allSettled to handle partial failures
        const batchResults = await Promise.allSettled(
        batchUrls.map((url) => limit(() => fetchDataFromPrensalink(url, token)))
        );

        batchResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
            const data = result.value;

            // Ensure the data is valid before adding to allData
            if (Array.isArray(data)) {
            allData.push(...data);
            } else {
            console.error(`Invalid data format for URL: ${batchUrls[index]}`);
            }
        } else {
            console.error(`Failed to fetch data for URL: ${batchUrls[index]}`);
            console.error(result.reason); // Log the error reason
        }
        });

        // Update progress
        processedUrls += batchUrls.length;
        const progressPercentage = ((processedUrls / totalUrls) * 100).toFixed(2);
        console.log(`Progress: ${progressPercentage}%`);
    }

    return allData;
};
