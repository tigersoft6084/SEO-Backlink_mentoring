import { GET_BACKLINK_FROM_MISTERGOODLINK_URL } from '@/globals/marketplaceUrls.ts';
import PQueue from 'p-queue';
import { fetchDataFromMistergoodlink } from '../fetchDataFromMarketplaces/mistergoodlink.ts';

const TOTAL_PAGES = 537;
const CONCURRENCY_LIMIT = 10; // Number of concurrent requests
const BATCH_SIZE = 100; // Limit the number of tasks enqueued at once

export const getAllDataFromMistergoodlink = async (cookie: string) => {
  if (!cookie) {
    throw new Error('API cookie is missing');
  }

  const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
  const results = new Set();
  let processedPages = 0;

  const fetchPageData = async (page: number) => {
    const url = `${GET_BACKLINK_FROM_MISTERGOODLINK_URL}?page=${page}`;
    try {
      const data = await fetchDataFromMistergoodlink(url, cookie);
      if (data) {
        data.forEach((item: any) => results.add(JSON.stringify(item)));
      }
    } catch (error) {
      console.error(
        `Failed to fetch data for page ${page}:`,
        error instanceof Error ? error.message : error
      );
    }

    // Update progress after processing each page
    processedPages += 1;
    const progressPercentage = ((processedPages / TOTAL_PAGES) * 100).toFixed(2);
    console.log(`Fetching page from Mistergoodlink Progress: ${progressPercentage}%`);
  };

  // Process in batches
  for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);

    // Add batch of tasks to the queue
    const tasks = [];
    for (let page = start; page <= end; page++) {
      tasks.push(queue.add(() => fetchPageData(page)));
    }

    // Wait for the current batch to finish
    await Promise.all(tasks);
  }

  // Convert Set back to an array and parse serialized items
  const deduplicatedResults = Array.from(results).map((item) =>
    JSON.parse(item as string)
  );

  console.log(`Fetched data from ${deduplicatedResults.length} unique entries.`);
  return deduplicatedResults;
};
