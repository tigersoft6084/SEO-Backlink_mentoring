import { GET_BACKLINK_FROM_PRENSALINK_URLS } from "@/globals/globalURLs.ts";
import { fetchDataFromPrensalink } from "../fetchDataFromMarketplaces/prensalink.ts";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { MARKETPLACE_NAME_PRENSALINK } from "@/globals/strings.ts";
import { Payload } from "payload";
import PQueue from "p-queue";

const TOTAL_PAGES = 33;
const CONCURRENCY_LIMIT = 10;
const BATCH_SIZE = 20;

export const getAllDataFromPrensalink = async (
    token: string,
    payload : Payload
): Promise<void> => {

    if (!token) {
        throw new Error("API token is missing");
    }

    const queue = new PQueue( { concurrency : CONCURRENCY_LIMIT} );
    const seenDomains = new Set<string>();

    const fetchPageData = async (page: number) => {
        const url = `${GET_BACKLINK_FROM_PRENSALINK_URLS}&page=${page}&pageSize=500&order=default`;

        try {
            console.log(`Fetching Prensalink page ${page}...`);
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
        } catch (error) {
            console.error(
                `Failed to fetch data for page ${page}:`,
                error instanceof Error ? error.message : error
            );
        }
    };

    for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);

        const tasks = [];
        for (let page = start; page <= end; page++) {
            tasks.push(queue.add(() => fetchPageData(page)));
        }

        await Promise.all(tasks);
    }

    console.log("Prensalink data processing complete.");



    // const limit = pLimit(5); // Limit concurrent requests to 5
    // const totalUrls = GET_BACKLINK_FROM_PRENSALINK_URLS.length;



    // for (let i = 0; i < totalUrls; i += batchSize) {
    //     const batchUrls = GET_BACKLINK_FROM_PRENSALINK_URLS.slice(i, i + batchSize);

    //     console.log(`Processing batch from index ${i} to ${i + batchUrls.length}`);

    //     // Use Promise.allSettled to handle partial failures
    //     await Promise.allSettled(
    //         batchUrls.map((url) => limit(async() => {

    //             try{

    //                 const data = await fetchDataFromPrensalink(url, token);

    //                 if(Array.isArray(data) && data.length > 0){

    //                     for(const item of data){

    //                         if(!seenDomains.has(item.domain)){

    //                             seenDomains.add(item.domain);

    //                             await uploadToDatabase(payload, item, MARKETPLACE_NAME_PRENSALINK);

    //                         }
    //                     }

    //                     console.log(`Processed page Prensalink, items : ${data.length}`);
    //                 }else{

    //                     console.warn(`No data found on page for ${url}`);

    //                 }
    //             }catch(error){
    //                 console.error(`Error fetching data for url : ${url} : `, error instanceof Error ? error.message : error);
    //             }

    //         }))
    //     );
    // }
};
