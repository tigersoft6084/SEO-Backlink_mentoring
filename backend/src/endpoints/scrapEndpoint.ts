import { Endpoint } from 'payload';
import { scraperService } from '../services/scraperService';
import { getMarketPlaces } from '@/services/marketPlacePlatformService';

export const scrapEndpoint: Endpoint = {
  path: '/marketPlaceScraping',
  method: 'get',
  handler: async () => {
    try {
      // Fetch the marketplaces
      const marketplaces = await getMarketPlaces();

      if (!Array.isArray(marketplaces) || marketplaces.length === 0) {
        return new Response(JSON.stringify({
          message: 'No marketplaces found.',
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Iterate over the marketplaces and scrape data
      const scrapeResults = await Promise.all(
        marketplaces.map(async ({ name, website }) => {
          try {
            const response = await scraperService(website);

            // Parse the response if it contains a `json` method
            const scrapedData = typeof response.json === 'function'
              ? await response.json()
              : response;

            return {
              name,
              website,
              data: scrapedData,
              success: true,
            };
          } catch (scrapeError : any) {
            console.error(`Error scraping ${website}:`, scrapeError);
            return {
              name,
              website,
              error: scrapeError.message || 'Scraping failed',
              success: false,
            };
          }
        })
      );

      // Return the collected results
      return new Response(JSON.stringify({
        message: 'Scraping completed.',
        results: scrapeResults,
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
