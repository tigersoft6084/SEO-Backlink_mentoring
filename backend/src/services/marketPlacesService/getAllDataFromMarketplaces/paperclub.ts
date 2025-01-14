import { GET_BACKLINK_FROM_PAPERCLUB_URLS } from "@/global/marketplaceUrls.ts";
import pLimit from "p-limit";
import { fetchDataFromPaperclub } from "../fetchDataFromMarketplaces/paperclub.ts";

export const getAllDataFromPaperclub = async (token: string) => {
  if (!token) {
    throw new Error("API token is missing");
  }

  const limit = pLimit(2); // Limit concurrent requests to 2
  const batchSize = 10; // Process 10 URLs in a batch
  const totalURLs = GET_BACKLINK_FROM_PAPERCLUB_URLS.length; // Total URLs
  let processedURLs = 0; // Track processed URLs

  const allData = [];

  // Process URLs in batches
  for (let i = 0; i < totalURLs; i += batchSize) {
    const batchUrls = GET_BACKLINK_FROM_PAPERCLUB_URLS.slice(i, i + batchSize);

    // console.log(`Processing batch from index ${i} to ${i + batchUrls.length}`);

    const batchResults = await Promise.all(
      batchUrls.map((url) => limit(() => fetchDataFromPaperclub(url, token)))
    );

    // Flatten and store results
    allData.push(...batchResults);

    // Track progress
    processedURLs += batchUrls.length;
    console.log(`Fetching Backlinks fromm Paperclub: ${((processedURLs / totalURLs) * 100).toFixed(2)}%`);
  }

  return allData;
};
