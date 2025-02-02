import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";
import pLimit from "p-limit";
import { fetchDataFromSeojungle } from "../fetchDataFromMarketplaces/seojungle.ts";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { Payload } from "payload";
import { MARKETPLACE_NAME_SEOJUNGLE } from "@/globals/strings.ts";

const MAX_CONCURRENT_REQUESTS = 10; // Maximum concurrent requests
const limit = pLimit(MAX_CONCURRENT_REQUESTS);

const MAX_RETRIES = 3; // Retry limit

export const getAllDataFromSeojungle = async (
    token: string,
    themes: string[],
    totalPages: number,
    payload: Payload
): Promise<void> => {
    if (!token) {
        throw new Error("API token is missing");
    }

    const seenDomains = new Set<string>();
    const promises: Promise<void>[] = [];

    console.log(`Starting data fetching for themes: ${themes.join(", ")}, Total Pages: ${totalPages}`);

    for (let page = 0; page < totalPages; page++) {
        console.log(`Processing page ${page}...`);

        promises.push(
            limit(async () => {
                let attempt = 0;
                let data: FetchedBackLinkDataFromMarketplace[] = [];

                while (attempt < MAX_RETRIES) {
                    console.log(`Fetching data for page ${page}, Attempt: ${attempt + 1}...`);
                    try {
                        const result = await fetchDataFromSeojungle(token, page, themes);
                        if (result instanceof Response) {
                            console.error(`Error fetching data for page ${page}:`, result.statusText);
                        } else {
                            data = result;
                            console.log(`✅ Successfully fetched ${data.length} items for page ${page}`);
                            if (data.length > 0) break; // ✅ Stop retrying if data is received
                        }
                    } catch (error) {
                        console.error(`❌ Attempt ${attempt + 1} failed for page ${page}:`, error);
                    }
                    attempt++;
                    await new Promise(res => setTimeout(res, 1000)); // ✅ Delay between retries
                }

                if (data.length === 0) {
                    console.warn(`⚠️ Skipping page ${page} after ${MAX_RETRIES} retries.`);
                    return;
                }

                console.log(`Filtering unique domains for page ${page}...`);
                const uniqueItems = data.filter(item => !seenDomains.has(item.domain));
                uniqueItems.forEach(item => seenDomains.add(item.domain));

                console.log(`Uploading ${uniqueItems.length} unique backlinks to the database for page ${page}...`);
                await Promise.all(
                    uniqueItems.map(item => uploadToDatabase(payload, item, MARKETPLACE_NAME_SEOJUNGLE))
                );
                console.log(`✅ Page ${page} processed successfully.`);
            })
        );
    }

    await Promise.allSettled(promises);
    console.log(`🎉 Completed fetching backlinks for themes: ${themes.join(", ")}`);
};
