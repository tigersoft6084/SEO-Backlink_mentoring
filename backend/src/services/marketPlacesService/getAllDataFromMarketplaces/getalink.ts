import { Payload } from 'payload';
import PQueue from 'p-queue';
import { fetchDataFromGetalink } from '../fetchDataFromMarketplaces/getalink.ts';
import { GET_BACKLINK_FROM_GETALINK_URL } from '@/globals/globalURLs.ts';
import { uploadToDatabase } from '../uploadDatabase.ts';
import { MARKETPLACE_NAME_GETALINK } from '@/globals/strings.ts';

const TOTAL_PAGES = 165;
const CONCURRENCY_LIMIT = 50; // Number of concurrent requests
const BATCH_SIZE = 165; // Limit the number of tasks enqueued at once

export const getAllDataFromGetalink = async (token: string, payload : Payload) : Promise<void> => {
  if (!token) {
    throw new Error('API token is missing');
  }

  const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
  const seenDomains = new Set<string>(); // Track processed domains to avoid duplicates

  const fetchPageData = async (page: number) => {
    const url = `${GET_BACKLINK_FROM_GETALINK_URL}?page=${page}&page_size=100&currency=EUR&filtersCount=0&type_link=&allowed_links=0&country=&language=&name=&category=&type=&pasa_por_portada=&type_price=Coste&cf=&da=&dr=&pa=&rd=&tf=&regions=&ur=&marca_patrocinado=&show_favorites=false&nuevos=false&usuario_id=0`;
    try {
      console.log(`Fetching page ${page}...`);
      const data = await fetchDataFromGetalink(url, token);
      if (Array.isArray(data) && data.length > 0) {
        for(const item of data){
          if(!seenDomains.has(item.domain)){
            seenDomains.add(item.domain);
            await uploadToDatabase(payload, item, MARKETPLACE_NAME_GETALINK);
          }
        }
        console.log(`Processed page ${page}, items: ${data.length}`);
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
    try {
      // Wait for the current batch of tasks to complete
      await Promise.all(tasks);
      console.log(`Batch from page ${start} to ${Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES)} completed.`);
    } catch (error) {
      console.error(`Error processing batch starting at page ${start}:`, error);
    }
  }


  console.log('All pages processed.');
};
