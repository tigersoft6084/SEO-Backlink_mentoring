
import { Payload } from "payload";
import PQueue from "p-queue";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { GET_BACKLINK_FROM_LEMMILINK } from "@/globals/globalURLs.ts";
import { fetchDataFromLemmilink } from "../fetchDataFromMarketplaces/lemmilink.ts";
import { MARKETPLACE_NAME_LEMMILINK } from "@/globals/strings.ts";

const TOTAL_PAGES = 548;
const CONCURRENCY_LIMIT = 100;
const BATCH_SIZE = 200;

export const getAllDataFromLemmilink = async (tokenAndId: {access_token : string, user_id : string}, payload : Payload) : Promise<void> => {

    if(!tokenAndId){
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>();

    const fetchPageData = async(page : number) : Promise<void> => {

        const url = `${GET_BACKLINK_FROM_LEMMILINK}?page=${page}&pageSize=12&ttf=&tf=&cf=&totalKeyword=&trafficEstimate=&category=&rd=&langue=&minPrice=0&maxPrice=3000&verified=true`;
        console.log(`Fetching Lemmilink page ${page}...`);

        try{

            const data = await fetchDataFromLemmilink(url, tokenAndId)

            if (data && Array.isArray(data)) {
                for (const item of data) {
                    if (!seenDomains.has(item.domain)) {
                        seenDomains.add(item.domain); // Track processed domain
                        await uploadToDatabase(payload, item, MARKETPLACE_NAME_LEMMILINK); // Upload to database
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

    console.log("Lemmilink data processing complete.");
}