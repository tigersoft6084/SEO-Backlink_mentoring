import { GET_BACKLINK_FROM_PAPERCLUB_URLS } from "@/globals/globalURLs.ts";
import PQueue from "p-queue";
import { fetchDataFromPaperclub } from "../fetchDataFromMarketplaces/paperclub.ts";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { MARKETPLACE_NAME_PAPERCLUB } from "@/globals/strings.ts";
import { Payload } from "payload";

export const getAllDataFromPaperclub = async (
  token: string,
  payload : Payload
): Promise<void> => {
  if (!token) {
    throw new Error("API token is missing");
  }

  const queue = new PQueue({ concurrency: 50 }); // Limit concurrent requests to 2
  const batchSize = 100; // Process 10 URLs in a batch
  const totalURLs = GET_BACKLINK_FROM_PAPERCLUB_URLS.length; // Total URLs

  const seenDomains = new Set<string>();

  // Process URLs in batches
  for (let i = 0; i < totalURLs; i += batchSize) {
    const batchUrls = GET_BACKLINK_FROM_PAPERCLUB_URLS.slice(i, i + batchSize);

    console.log(`Processing batch from index ${i} to ${i + batchUrls.length}`);

    await Promise.allSettled(

      batchUrls.map((url) =>

        queue.add(async () => {

          try{

            const data = await fetchDataFromPaperclub(url, token);

            if(Array.isArray(data) && data.length > 0){

              for(const item of data){

                if(!seenDomains.has(item.domain)){

                  seenDomains.add(item.domain);

                  await uploadToDatabase(payload, item, MARKETPLACE_NAME_PAPERCLUB);

                }
              }

              console.log(`Processed page Paperclub, items : ${data.length}`);
            }else{

              console.warn(`No data found on page for ${url}`);
            }

          }catch(error){
            console.error(`Error fetching data for url : ${url} : `, error instanceof Error ? error.message : error);
          }

        })
      )
    );
  };
}

