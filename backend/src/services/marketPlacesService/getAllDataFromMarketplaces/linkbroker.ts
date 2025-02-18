import PQueue from 'p-queue';
import { Payload } from 'payload';
import { uploadToDatabase } from '../uploadDatabase.ts';
import { GET_BACKLINK_FROM_LINKBROKER_URL } from '@/globals/globalURLs.ts';
import { MARKETPLACE_NAME_LINKBROKER } from '@/globals/strings.ts';
import { fetchDataFromLinkbroker } from '../fetchDataFromMarketplaces/linkbroker.ts';

const CONCURRENCY_LIMIT = 10 ; // Number of concurrent requests
const BATCH_SIZE = 20 ; // Tasks enqueued at once
const MAX_PAGES = 2254; // Upper limit for total pages

export const getAllDataFromLinkbroker = async (Token: string, payload: Payload): Promise<void> => {
    if (!Token) {
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>(); // Track processed domains to avoid duplicates

    const fetchPageData = async (page: number): Promise<void> => {
        console.log(`Fetching Linkbroker page ${page}...`);

        try {
            const data = await fetchDataFromLinkbroker(GET_BACKLINK_FROM_LINKBROKER_URL, Token, page);

            if (Array.isArray(data) && data.length > 0) {
                for (const item of data) {
                if (!seenDomains.has(item.domain)) {
                    seenDomains.add(item.domain); // Mark domain as processed
                    await uploadToDatabase(payload, item, MARKETPLACE_NAME_LINKBROKER);
                }
                }
                console.log(`Processed page ${page}, items: ${data.length}`);
            } else {
                console.warn(`No data found on page ${page}.`);
            }
        } catch (error) {
        console.error(`Error fetching data for page ${page}:`, error instanceof Error ? error.message : error);
        }
    };

    // Process pages in batches
    for (let start = 1; start <= MAX_PAGES; start += BATCH_SIZE) {
        const tasks = [];
        for (let page = start; page < Math.min(start + BATCH_SIZE, MAX_PAGES + 1); page++) {
        tasks.push(queue.add(() => fetchPageData(page)));
        }

        try {
            // Wait for the current batch of tasks to complete
            await Promise.all(tasks);
            console.log(`Batch from page ${start} to ${Math.min(start + BATCH_SIZE - 1, MAX_PAGES)} completed.`);
        } catch (error) {
            console.error(`Error processing batch starting at page ${start}:`, error);
        }

    }

    console.log('All pages processed.');
};
