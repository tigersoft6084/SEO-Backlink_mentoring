import PQueue from 'p-queue';
import { Payload } from 'payload';
import { fetchDataFromEreferer } from '../fetchDataFromMarketplaces/ereferer.ts';
import { GET_BACKLINK_FROM_Ereferer_URL } from '@/globals/marketplaceUrls.ts';
import { uploadToDatabase } from '../uploadDatabase.ts';

const CONCURRENCY_LIMIT = 100 ; // Number of concurrent requests
const BATCH_SIZE = 200 ; // Tasks enqueued at once
const MAX_PAGES = 950; // Upper limit for total pages

export const getAllDataFromEreferer = async (cookie: string, payload: Payload): Promise<void> => {
  if (!cookie) {
    throw new Error('API cookie is missing');
  }

  const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
  const seenDomains = new Set<string>(); // Track processed domains to avoid duplicates

  const fetchPageData = async (page: number): Promise<void> => {
    const url = `${GET_BACKLINK_FROM_Ereferer_URL}?page=${page}`;
    console.log(`Fetching Ereferer page ${page}...`);

    try {
      const data = await fetchDataFromEreferer(url, `${cookie}; _locale=en`);

      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          if (!seenDomains.has(item.domain)) {
            seenDomains.add(item.domain); // Mark domain as processed
            await uploadToDatabase(payload, item, "Ereferer");
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
