import { COLLECTION_NAME_BACKLINK } from "@/globals/strings.ts";
import { Payload } from "payload";
import { fetchMajesticData } from "./getIndexItemInfo.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";

export const updateDBwithMajesticInfo = async (payload: Payload) => {
    try {
        let page = 1;
        let hasMore = true;
        let processedCount = 0; // Counter to track processed domains

        console.log("Starting updateDBwithMajesticInfo...");

        while (hasMore) {
            console.log(`Fetching domains from database - Page: ${page}`);

            const response = await payload.find({
                collection: COLLECTION_NAME_BACKLINK,
                select: {domain : true}, // Corrected select format
                page: page,
                limit: 1000 // Fetch 1000 at a time to avoid large queries (adjustable)
            });

            if (response.docs.length > 0) {
                const domains = response.docs;

                await Promise.all(domains.map(async (doc) => {
                    await fetchMajesticData(payload, doc.domain);
                    processedCount++;

                    // Log every 1000 processed domains
                    if (processedCount % 1000 === 0) {
                        console.log(`Processed ${processedCount} domains so far...`);
                    }
                }));

                page++;
            } else {
                console.log("No more domains left to process.");
                hasMore = false;
            }
        }

        console.log(`Completed updateDBwithMajesticInfo. Total processed: ${processedCount}`);
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Paperclub");
        console.error("Error occurred:", errorDetails, "Status:", status);
        return null;
    }
};
