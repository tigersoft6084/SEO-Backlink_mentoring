import PQueue from 'p-queue';
import { fetchDataFromEreferer } from '../fetchDataFromMarketplaces/ereferer.ts';
import { GET_BACKLINK_FROM_Ereferer_URL } from '@/global/marketplaceUrls.ts';
import { FetchedBackLinkDataFromMarketplace } from '@/types/backlink.js';

const CONCURRENCY_LIMIT = 10; // Increase concurrency for faster processing
const BATCH_SIZE = 30; // Larger batch size for better throughput
const MAX_PAGES = 950; // Set a reasonable upper limit for pages

export const getAllDataFromEreferer = async (cookie: string): Promise<FetchedBackLinkDataFromMarketplace[]> => {
  if (!cookie) {
    throw new Error('API cookie is missing');
  }

  const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
  const results = new Set<FetchedBackLinkDataFromMarketplace>(); // Directly store objects in Set

  const fetchPageData = async (page: number) => {
    const url = `${GET_BACKLINK_FROM_Ereferer_URL}?page=${page}`;
    try {
      console.log(`Fetching Ereferer page ${page}...`);
      const data = await fetchDataFromEreferer(url, `${cookie}; _locale=en`);
      if (Array.isArray(data)) {
        data.forEach((item: FetchedBackLinkDataFromMarketplace) => results.add(item)); // Add objects directly
      }
    } catch (error) {
      console.error(`Failed to fetch data for page ${page}:`, error instanceof Error ? error.message : error);
    }
  };

  // Fetch pages in batches
  const pagePromises: Promise<void>[] = [];
  for (let start = 1; start <= MAX_PAGES; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1, MAX_PAGES);

    // Add tasks for the current batch
    for (let page = start; page <= end; page++) {
      pagePromises.push(queue.add(() => fetchPageData(page)));
    }
  }

  // Wait for all pages to be processed
  await Promise.all(pagePromises);

  // Convert Set to an array for return
  const deduplicatedResults = Array.from(results);

  console.log(`Fetched data from ${deduplicatedResults.length} unique entries.`);
  return deduplicatedResults;
};
