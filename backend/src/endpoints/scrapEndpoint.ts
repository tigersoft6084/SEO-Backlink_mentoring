import { Endpoint, PayloadRequest } from 'payload';
import { scraperService } from '../services/scraperService';

export const scrapEndpoint: Endpoint = {
  path: '/paperClub',
  method: 'get',
  handler: async () => {
    try {
      // Call scraperService to scrape data
      const response = await scraperService('https://www.paper.club/en/');

      // Parse the response if it contains a `json` method
      const scrapedData = typeof response.json === 'function' ? await response.json() : response;

      // Return the response in JSON format
      if (Array.isArray(scrapedData) && scrapedData.length > 0) {
        return new Response(JSON.stringify({
          message: 'Data scraped and saved successfully.',
          data: scrapedData,
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        message: scrapedData,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Error occurred while scraping:', error);

      return new Response(JSON.stringify({
        message: 'An error occurred while scraping data.',
        error: error.message || 'Unknown error',
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
