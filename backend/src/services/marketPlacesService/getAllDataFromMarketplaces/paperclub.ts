import { GET_BACKLINK_FROM_PAPERCLUB_URLS } from "@/global/marketplaceUrls.ts";
import pLimit from "p-limit";
import { fetchDataFromPaperclub } from "../fetchDataFromMarketplaces/paperclub.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";

export const getAllDataFromPaperclub = async (
  token: string
): Promise<FetchedBackLinkDataFromMarketplace[]> => {
  if (!token) {
    throw new Error("API token is missing");
  }

  const limit = pLimit(2); // Limit concurrent requests to 2
  const batchSize = 10; // Process 10 URLs in a batch
  const totalURLs = GET_BACKLINK_FROM_PAPERCLUB_URLS.length; // Total URLs
  let processedURLs = 0; // Track processed URLs

  const allData: FetchedBackLinkDataFromMarketplace[] = [];

  // Process URLs in batches
  for (let i = 0; i < totalURLs; i += batchSize) {
    const batchUrls = GET_BACKLINK_FROM_PAPERCLUB_URLS.slice(i, i + batchSize);

    console.log(`Processing batch from index ${i} to ${i + batchUrls.length}`);

    const batchResults = await Promise.allSettled(
      batchUrls.map((url) => limit(() => fetchDataFromPaperclub(url, token)))
    );

    // Handle results
    batchResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const data = result.value;

        // Narrow the type to check if it's an array or Response
        if (Array.isArray(data)) {
          allData.push(...data);
        } else if (isResponse(data)) {
          console.error(`Unexpected Response object for URL: ${batchUrls[index]}`);
          console.error(`Response status: ${data.status}`);
        } else {
          console.error(`Unexpected data format for URL: ${batchUrls[index]}`);
        }
      } else {
        console.error(`Failed to fetch data for URL: ${batchUrls[index]}`);
        console.error(result.reason); // Log the error reason
      }
    });

    // Track progress
    processedURLs += batchUrls.length;
    console.log(
      `Fetching Backlinks from Paperclub: ${(
        (processedURLs / totalURLs) *
        100
      ).toFixed(2)}%`
    );
  }

  return allData;
};

// Helper function to check if a value is a Response object
const isResponse = (value: unknown): value is Response => {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof (value as Response).status === "number"
  );
};
