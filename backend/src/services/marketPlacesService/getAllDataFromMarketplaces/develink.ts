import { GET_BACKLINK_FROM_DEVELINK_URL } from '@/global/marketplaceUrls.ts';
import PQueue from 'p-queue';
import { fetchDataFromDevelink } from '../fetchDataFromMarketplaces/develink.ts';
import { FetchedBackLinkDataFromMarketplace } from '@/types/backlink.js';

const TOTAL_PAGES = 1411;
const CONCURRENCY_LIMIT = 50; // Number of concurrent requests
const BATCH_SIZE = 200; // Limit the number of tasks enqueued at once

export const getAllDataFromDevelink = async (cookie: string) => {
  if (!cookie) {
    throw new Error('API cookie is missing');
  }

  const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
  const results: FetchedBackLinkDataFromMarketplace[] = [];
  const seenDomains = new Set<string>(); // Track domains to avoid duplicates

  const fetchPageData = async (page: number) => {
    const url = `${GET_BACKLINK_FROM_DEVELINK_URL}?page=${page}`;
    try {
      console.log(`Fetching Develink page ${page}...`);
      const data = await fetchDataFromDevelink(url, cookie);

      if (data && Array.isArray(data)) {
        data.forEach((item: FetchedBackLinkDataFromMarketplace) => {
          // Check if the domain is already processed
          if (!seenDomains.has(item.domain)) {
            results.push(item);
            seenDomains.add(item.domain); // Mark domain as seen
          }
        });
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

  // Process pages in batches
  for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);

    // Add batch of tasks to the queue
    const tasks = [];
    for (let page = start; page <= end; page++) {
      tasks.push(queue.add(() => fetchPageData(page)));
    }

    // Wait for all tasks in the current batch to finish
    await Promise.all(tasks);
  }

  console.log(`Fetched data from ${results.length} unique entries.`);
  return results;
};
