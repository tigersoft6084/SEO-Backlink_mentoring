import PQueue from 'p-queue';
import { fetchDataFromGetalink } from '../fetchDataFromMarketplaces/getalink.ts';
import { GET_BACKLINK_FROM_GETALINK_URL } from '@/globals/marketplaceUrls.ts';

const TOTAL_PAGES = 158;
const CONCURRENCY_LIMIT = 10; // Number of concurrent requests
const BATCH_SIZE = 200; // Limit the number of tasks enqueued at once

export const getAllDataFromGetalink = async (token: string) => {
  if (!token) {
    throw new Error('API token is missing');
  }

  const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
  const results = new Set();

  const fetchPageData = async (page: number) => {
    const url = `${GET_BACKLINK_FROM_GETALINK_URL}?page=${page}&page_size=100&currency=EUR&filtersCount=0&type_link=&allowed_links=0&country=&language=&name=&category=&type=&pasa_por_portada=&type_price=Coste&cf=&da=&dr=&pa=&rd=&tf=&regions=&ur=&marca_patrocinado=&show_favorites=false&nuevos=false&usuario_id=0`;
    try {
      console.log(`Fetching page ${page}...`);
      const data = await fetchDataFromGetalink(url, token);
      if (data) {
        data.forEach((item: any) => results.add(JSON.stringify(item)));
      }
    } catch (error) {
      console.error(
        `Failed to fetch data for page ${page}:`,
        error instanceof Error ? error.message : error
      );
    }
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
