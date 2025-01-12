import { Endpoint } from 'payload';
import { fetchSerpData } from '../services/serpService';

// Function to extract links from SERP results, excluding duplicates by domain and adding the keyword
function extractLinks(serpResults: any, keyword: string) {
  const links: any = [];
  const seenDomains = new Set<string>();  // Set to track seen domains

  // Iterate through all results and add the link only if the domain has not been seen before
  serpResults.result[0].items.forEach((item: any) => {
    if (item.url && item.domain && !seenDomains.has(item.domain)) {
      links.push({
        url: item.url,
        domain: item.domain,
        keyword, // Add the keyword to each link object
      });
      seenDomains.add(item.domain);
    }
  });

  return links;
}

// Optimized handler to fetch and merge SERP data with less processing time
export const fetchSerpEndpoint: Endpoint = {
  path: '/fetch-serp', // Endpoint path
  method: 'post',      // HTTP method (POST in this case)
  handler: async (Request: any) => {
    try {
      const body = await Request.json(); // Assuming Request is the Fetch API request object
      const { keywords, locationCode, languageCode, depth } = body;

      // Input validation
      if (!keywords || !locationCode || !languageCode || !depth) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Ensure that keywords is an array
      if (!Array.isArray(keywords)) {
        return new Response(
          JSON.stringify({ error: 'Keywords should be an array' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Limit concurrent requests to avoid overwhelming system resources (e.g., 5 concurrent requests max)
      const maxConcurrentRequests = 5;
      const allLinksByKeyword: { [key: string]: any[] } = {}; // Store links by keyword
      const seenDomains = new Set<string>(); // Set to track domains across all keywords

      // Helper function to fetch and process each keyword
      const fetchAndProcessKeyword = async (keyword: string) => {
        try {
          const serpData = await fetchSerpData(keyword, locationCode, languageCode, depth);
          const links = extractLinks(serpData, keyword);

          // Add the links to the result array only if the domain hasn't been seen already
          const uniqueLinks = links.filter((link: any) => {
            if (!seenDomains.has(link.domain)) {
              seenDomains.add(link.domain);
              return true;
            }
            return false;
          });

          // Store the links for this keyword in order
          allLinksByKeyword[keyword] = uniqueLinks;
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error fetching data for keyword: ${keyword}`, error.message);
          } else {
            console.error(`Error fetching data for keyword: ${keyword}`, error);
          }
        }
      };

      // Function to limit the number of concurrent requests
      const processKeywordsConcurrently = async (keywords: string[]) => {
        const queue: any[] = [];
        for (const keyword of keywords) {
          // Limit the concurrent requests by processing them in batches
          const promise = fetchAndProcessKeyword(keyword);
          queue.push(promise);

          if (queue.length >= maxConcurrentRequests) {
            await Promise.race(queue); // Wait for one of the promises to resolve
            queue.splice(queue.findIndex(p => p === promise), 1); // Remove the resolved promise
          }
        }

        // Wait for all remaining promises to resolve
        await Promise.all(queue);
      };

      // Process keywords concurrently
      await processKeywordsConcurrently(keywords);

      // Now the order of the links is preserved as per the original keyword order
      const orderedLinks: any[] = [];
      keywords.forEach((keyword: string) => {
        if (allLinksByKeyword[keyword]) {
          orderedLinks.push(...allLinksByKeyword[keyword]); // Merge links by keyword in the original order
        }
      });

      // Return the merged, sorted, and deduplicated results
      return new Response(
        JSON.stringify({ results: [{ links: orderedLinks }] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {
      console.error('Error fetching SERP data:', error);

      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
