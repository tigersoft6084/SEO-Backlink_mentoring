import axios from "axios";
import pLimit from "p-limit";
import axiosRetry from "axios-retry";
import { GET_BACKLINK_FROM_PAPERCLUB_URLS } from "@/global/marketplaceUrls";
import { BackLinkData, PaperClubResult } from "@/types/backlink";
import { getTokenForPaperClub } from "../getTokens/paperclub";

// Setup retry mechanism with axios
axiosRetry(axios, {
  retries: 3, // Retry failed requests up to 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Retry delay with exponential backoff
  retryCondition: (error) => axios.isAxiosError(error), // Retry only Axios-related errors
});

// Function to fetch data from a single URL with timeout and retry
const fetchDataFromUrl = async (url : string, Token : string) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${Token}` },
    });
    return response.data.currentPageResults || [];
  } catch (error : any) {
    console.error(`Failed to fetch URL: ${url}`, error.message);
    return []; // Return an empty array in case of failure
  }
};

// Function to process URLs in batches with p-limit
export const getPaperclubData = async () => {

  const Token = await getTokenForPaperClub();

  if (!Token) {
    throw new Error("API token is missing");
  }

  const limit = pLimit(2); // Limit concurrent requests to 2
  const batchSize = 10; // Process 10 URLs in a batch
  const allData : BackLinkData[] = [];

  for (let i = 0; i < GET_BACKLINK_FROM_PAPERCLUB_URLS.length; i += batchSize) {
    const batchUrls = GET_BACKLINK_FROM_PAPERCLUB_URLS.slice(i, i + batchSize);
    console.log(`Processing batch: ${batchUrls}`);

    // Fetch data for the current batch of URLs
    const batchResults = await Promise.all(
      batchUrls.map((url) => limit(() => fetchDataFromUrl(url, Token)))
    );

    console.log(`Batch results:`, batchUrls);

    // Flatten and process the results
    batchResults.forEach((results) => {
      if (results && Array.isArray(results)) {
        allData.push(
          ...results.map((result: PaperClubResult) => {
            const kpi = result.kpi || {};
            const article = result.articles?.[0] || {};
    
            return {
              domain: result.name || "Unknown",
              tf: kpi.trustFlow || 0,
              cf: kpi.citationFlow || 0,
              rd: kpi.refDomain || 0,
              price: article.price || 0,
            };
          })
        );
      }else{
        console.error(`Unexpected result format for batch: ${batchUrls}`);
      }
    });
  }

  return allData;
};