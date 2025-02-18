import { Payload } from "payload";
import PQueue from "p-queue";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { GET_BACKLINK_FROM_SOUMETTRE_URL } from "@/globals/globalURLs.ts";
import { MARKETPLACE_NAME_SOUMETTRE } from "@/globals/strings.ts";
import { fetchDataFromSoumettre } from "../fetchDataFromMarketplaces/soumettre.ts";

const TOTAL_PAGES = 1282;
const CONCURRENCY_LIMIT = 100;
const BATCH_SIZE = 200;

export const getAllDataFromSoumettre = async (cookie : { X_CSRF_TOKEN: string; COOKIE: string }, payload : Payload) : Promise<void> => {

    if(!cookie){
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>();

    const fetchPageData = async(page : number) : Promise<void> => {

        console.log(`Fetching Soumettre page ${page}...`);

        try{

            const data = await fetchDataFromSoumettre(GET_BACKLINK_FROM_SOUMETTRE_URL, page,  cookie);

            return data;

            // if (data && Array.isArray(data)) {
            //     for (const item of data) {
            //         if (!seenDomains.has(item.domain)) {
            //             seenDomains.add(item.domain); // Track processed domain
            //             await uploadToDatabase(payload, item, MARKETPLACE_NAME_SOUMETTRE); // Upload to database
            //         }
            //     }
            // } else {
            //     console.warn(`No data fetched for page ${page}`);
            // }
        }catch(error){
            console.error(`Error fetching data for page ${page}:`, error instanceof Error ? error.message : error);
        }
    }

    // for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
    //     const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);

    //     const tasks = [];
    //     for (let page = start; page <= end; page++) {
    //         tasks.push(queue.add(() => fetchPageData(page)));
    //     }

    //     await Promise.all(tasks);
    // }

    const data = fetchPageData(1);
    return data;

    console.log("Soumettre data processing complete.");
}