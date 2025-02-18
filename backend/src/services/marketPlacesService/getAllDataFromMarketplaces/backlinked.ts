import { Payload } from "payload";
import PQueue from "p-queue";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { fetchDataFromBacklinked } from "../fetchDataFromMarketplaces/backlinked.ts";
import { MARKETPLACE_NAME_BACKLINKED } from "@/globals/strings.ts";
import { GET_BACKLINK_FROM_BACKLINKED_URL } from "@/globals/globalURLs.ts";

const TOTAL_PAGES = 1638;
const CONCURRENCY_LIMIT = 50;
const BATCH_SIZE = 100;

export const getAllDataFromBacklinked = async (cookie : { X_XSRF_TOKEN: string; COOKIE: string }, payload : Payload) : Promise<void> => {

    if(!cookie){
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>();

    const fetchPageData = async(page : number) : Promise<void> => {

        console.log(`Fetching Backlinked page ${page}...`);

        try{

            const data = await fetchDataFromBacklinked(GET_BACKLINK_FROM_BACKLINKED_URL, page,  cookie);

            if (data && Array.isArray(data)) {
                for (const item of data) {
                    if (!seenDomains.has(item.domain)) {
                        seenDomains.add(item.domain); // Track processed domain
                        await uploadToDatabase(payload, item, MARKETPLACE_NAME_BACKLINKED); // Upload to database
                    }
                }
            } else {
                console.warn(`No data fetched for page ${page}`);
            }
        }catch(error){
            console.error(`Error fetching data for page ${page}:`, error instanceof Error ? error.message : error);
        }
    }

    for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);

        const tasks = [];
        for (let page = start; page <= end; page++) {
            tasks.push(queue.add(() => fetchPageData(page)));
        }

        await Promise.all(tasks);
    }

    console.log("Backlinked data processing complete.");
}