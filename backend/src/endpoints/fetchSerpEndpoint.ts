// endpoints/fetchSerp.ts
import { Endpoint } from 'payload';
import { fetchSerpData } from '../services/serpService';

export const fetchSerpEndpoint: Endpoint = {
  path: '/fetch-serp', // Endpoint path
  method: 'post',      // HTTP method (POST in this case)
  handler: async (Request: any) => {
    try {
      // Parse the body
      const body = await Request.json(); // Assuming `Request` is the Fetch API request object

      const { keyword, locationCode, languageCode, depth } = body;

      // Input validation
      if (!keyword || !locationCode || !languageCode || !depth) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Fetch SERP data
      const serpData = await fetchSerpData(keyword, locationCode, languageCode, depth);

      // Extract links from SERP data
      const links = extractLinks(serpData);

      return new Response(
        JSON.stringify({ links, serpResults: serpData }),
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

// Function to extract links from SERP results
function extractLinks(serpResults: any) {
  const links : any = [];

  // Iterate through all results
  serpResults.result.forEach((item: any) => {
    // If the item has a 'url' property, add it to the links array
    if (item.url) {
      links.push({
        title: item.title || null,
        url: item.url,
        domain: item.domain || null,
      });
    }

    // Check for nested 'links' in the item
    if (item.links && Array.isArray(item.links)) {
      item.links.forEach((link: any) => {
        if (link.url) {
          links.push({
            title: link.title || null,
            url: link.url,
            domain: link.domain || null,
          });
        }
      });
    }

    // Check for nested links in 'items' (e.g., people_also_ask or other nested structures)
    if (item.items && Array.isArray(item.items)) {
      item.items.forEach((nestedItem: any) => {
        if (nestedItem.url) {
          links.push({
            title: nestedItem.title || null,
            url: nestedItem.url,
            domain: nestedItem.domain || null,
          });
        }
      });
    }
  });

  return links;
}
