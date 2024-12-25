import axios from "axios";
import pLimit from "p-limit";
import axiosRetry from "axios-retry";
import { getTokenForPrensalink } from "../getTokens/prensalink";
import { GET_BACKLINK_FROM_PRENSALINK_URLS } from "@/global/marketplaceUrls";
import { BackLinkData, PrensalinkResult } from "@/types/backlink";



// Setup retry mechanism with axios
axiosRetry(axios, {
  retries: 3, // Retry failed requests up to 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Retry delay with exponential backoff
  retryCondition: (error) => axios.isAxiosError(error), // Retry only Axios-related errors
});

// Function to fetch data from a single URL with timeout and retry
const fetchDataFromUrl = async (url: string, Token: string) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${Token}` },
      timeout: 30000, // Set timeout to 30 seconds
    });
    return response.data.items || []; // Assuming data.items contains the necessary data
  } catch (error: any) {
    console.error(`Failed to fetch URL: ${url}`, error.message);
    return []; // Return an empty array in case of failure
  }
};

// Function to extract domain from URL (i.e., from "https://www.abc.com" to "www.abc.com")
function getDomain(url: string): string {
    try {
      // Ensure the URL is properly prefixed with "http://" if it's not a full URL
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url; // Default to https if no scheme is provided
      }
      
      const parsedUrl = new URL(url); // Parse the complete URL
      return parsedUrl.hostname; // Extracts 'www.abc.com'
    } catch (error) {
      console.error(`Error occurred while parsing URL: ${url}`, error);
      return "Unknown"; // Fallback in case the URL is invalid
    }
}
  

// Function to process URLs in batches with p-limit
export const getPrensalinkData = async () => {
  const Token = await getTokenForPrensalink();

  console.log(Token)
  if (!Token) {
    throw new Error("API token is missing");
  }

  const limit = pLimit(2); // Limit concurrent requests to 2
  const batchSize = 10; // Process 10 URLs in a batch
  let allData: BackLinkData[] = [];

  for (let i = 0; i < GET_BACKLINK_FROM_PRENSALINK_URLS.length; i += batchSize) {
    const batchUrls = GET_BACKLINK_FROM_PRENSALINK_URLS.slice(i, i + batchSize);
    console.log(batchUrls);

    // Fetch data for the current batch of URLs
    const batchResults = await Promise.all(
      batchUrls.map((url) => limit(() => fetchDataFromUrl(url, Token)))
    );

    // Flatten and process the results
    batchResults.forEach((results) => {
      if (Array.isArray(results)) {
        allData.push(
          ...results.map((result: PrensalinkResult) => {
            // Safely access the first newspaper, if it exists
            const newspaper = result.newspapers && result.newspapers.length > 0 ? result.newspapers[0] : {};

            // Check if url exists and pass it to getDomain() or fallback to "Unknown"
            const domain = newspaper.url ? getDomain(newspaper.url) : "Unknown";

            return {
              domain, // Set domain name from 'url' of the first newspaper or default to "Unknown"
              tf: newspaper.metrics?.tf || 0, // Trust flow from metrics
              cf: newspaper.metrics?.cf || 0, // Citation flow from metrics
              rd: newspaper.metrics?.rd || 0, // Referring domains from metrics
              price: result.price || 0, // Price from the result
            };
          })
        );
      } else {
        console.error(`Unexpected result format for batch: ${batchUrls}`);
      }
    });
  }

  return allData;
};
