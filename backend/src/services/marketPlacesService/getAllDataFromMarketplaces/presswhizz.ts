
import PQueue from 'p-queue';
import { uploadToDatabase } from '../uploadDatabase.ts';
import { Payload } from 'payload';
import { GET_BACKLINK_FROM_PRESSWHIZZ_URL } from '@/globals/globalURLs.ts';
import { MARKETPLACE_NAME_PRESSWHIZZ } from '@/globals/strings.ts';
import { fetchDataFromPresswhizz } from '../fetchDataFromMarketplaces/presswhizz.ts';

const TOTAL_PAGES = 758;
const CONCURRENCY_LIMIT = 10; // Number of concurrent requests
const BATCH_SIZE = 20; // Limit the number of tasks enqueued at once

export const getAllDataFromPresswhizz = async (
    cookie: {
        token : string,
        COOKIE : string,
        csrfToken : string,
        baggageValue : string,
        sentryTraceValue : string,
        checksum : string,
        attributes : {
            'id' : string
        },
        children : Record<string, { fingerprint: string; tag: string }>
    },
    payload : Payload) => {
    if (!cookie) {
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>(); // Track processed domains to avoid duplicates

    const fetchPageData = async (page: number) => {

        console.log(`Fetching ${GET_BACKLINK_FROM_PRESSWHIZZ_URL} page ${page}...`);

        try {
        const data = await fetchDataFromPresswhizz(GET_BACKLINK_FROM_PRESSWHIZZ_URL, cookie, page);

        if(Array.isArray(data) && data.length > 0){
            for(const item of data){
            if(!seenDomains.has(item.domain)){
                seenDomains.add(item.domain);
                await uploadToDatabase(payload, item, MARKETPLACE_NAME_PRESSWHIZZ)
            }
            }

            console.log(`Processed page ${page}, items: ${data.length}`);
        }else{
            console.warn(`No data found on page ${page}.`);
        }

        } catch (error) {
        console.error(
            `Failed to fetch data for page ${page}:`,
            error instanceof Error ? error.message : error
        );
        }

    };

    // Process in batches
    // for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
    //     const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);

    //     // Add batch of tasks to the queue
    //     const tasks = [];
    //     for (let page = start; page <= end; page++) {
    //     tasks.push(queue.add(() => fetchPageData(page)));
    //     }

    //     try {
    //     // Wait for the current batch of tasks to complete
    //     await Promise.all(tasks);
    //     console.log(`Batch from page ${start} to ${Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES)} completed.`);
    //     } catch (error) {
    //     console.error(`Error processing batch starting at page ${start}:`, error);
    //     }

    // }

    const aa = await fetchPageData(1);

    return aa;

    console.log('All pages processed.');
};
