
import { Payload } from "payload";
import PQueue from "p-queue";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { MARKETPLACE_NAME_LINKBUILDERS } from "@/globals/strings.ts";
import { fetchDataFromLinkbuilders } from "../fetchDataFromMarketplaces/linkbuilders.ts";
import { GET_BACKLINK_FROM_LINKBUILDERS_URLS } from "@/globals/globalURLs.ts";

const TOTAL_PAGES = 609;
const CONCURRENCY_LIMIT = 100;
const BATCH_SIZE = 200;

export const getAllDataFromLinkbuilders = async (token : string, payload : Payload) : Promise<void> => {

    if(!token){
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>();

    const fetchPageData = async(page : number) : Promise<void> => {

        const url = `${GET_BACKLINK_FROM_LINKBUILDERS_URLS}?pageNo=${page}&size=50&excludeRejectedLink=true`;
        console.log(`Fetching Linkbuilders page ${page}...`);

        try{

            const data = await fetchDataFromLinkbuilders(url, token);

            if (data && Array.isArray(data)) {
                for (const item of data) {
                    if (!seenDomains.has(item.domain)) {
                        seenDomains.add(item.domain); // Track processed domain
                        await uploadToDatabase(payload, item, MARKETPLACE_NAME_LINKBUILDERS); // Upload to database
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

    console.log("Linkbuilders data processing complete.");
}