
import { Payload } from "payload";
import PQueue from "p-queue";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { GET_BACKLINK_FROM_PRENSALINK_URLS } from "@/globals/globalURLs.ts";
import { fetchDataFromPrensalink } from "../fetchDataFromMarketplaces/prensalink.ts";
import { MARKETPLACE_NAME_PRENSALINK } from "@/globals/strings.ts";

const TOTAL_PAGES = 278;
const CONCURRENCY_LIMIT = 10;
const BATCH_SIZE = 20;

export const getAllDataFromPrensalink = async (token : string, payload : Payload) : Promise<void> => {

    if(!token){
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>();

    const fetchPageData = async(page : number) : Promise<void> => {

        const url = `${GET_BACKLINK_FROM_PRENSALINK_URLS}&page=${page}&pageSize=50&order=default`;
        console.log(`Fetching Prensalink page ${page}...`);

        try{

            const data = await fetchDataFromPrensalink(url, token);

            if (data && Array.isArray(data)) {
                for (const item of data) {
                    if (!seenDomains.has(item.domain)) {
                        seenDomains.add(item.domain); // Track processed domain
                        await uploadToDatabase(payload, item, MARKETPLACE_NAME_PRENSALINK); // Upload to database
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

    console.log("Prensalink data processing complete.");
}