import { GET_BACKLINK_FROM_PRENSALINK_URLS } from "@/global/marketplaceUrls.ts";
import pLimit from "p-limit";
import { fetchDataFromPrensalink } from "../fetchDataFromMarketplaces/prensalink.ts";

export const getAllDataFromPrensalink = async (token: string) => {
    if (!token) {
        throw new Error("API token is missing");
    }

    const limit = pLimit(5); // Limit concurrent requests to 5
    const batchSize = 10; // Process 10 URLs in a batch
    const totalUrls = GET_BACKLINK_FROM_PRENSALINK_URLS.length;
    const allData = [];
    let processedUrls = 0;

    for (let i = 0; i < totalUrls; i += batchSize) {
        const batchUrls = GET_BACKLINK_FROM_PRENSALINK_URLS.slice(i, i + batchSize);

        // Fetch data for the current batch of URLs
        const batchResults = await Promise.all(
        batchUrls.map((url) => limit(() => fetchDataFromPrensalink(url, token)))
        );

        // Flatten the batch results and push to allData
        allData.push(...batchResults.flat());

        // Update progress
        processedUrls += batchUrls.length;
        const progressPercentage = ((processedUrls / totalUrls) * 100).toFixed(2);

        // Log progress to the console (or handle as needed)
        console.log(`Progress: ${progressPercentage}%`);

        // Optionally, you can return progress in a callback or store it elsewhere
        // (for example, sending it to a front-end via WebSockets or periodic requests)
    }

    return allData;
};
