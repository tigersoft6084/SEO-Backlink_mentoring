import { Endpoint, PayloadRequest } from 'payload';
import { withErrorHandling } from '@/middleware/errorMiddleware.ts';
import { marketplaceHandler } from '@/handlers/marketplaceHandler.ts';
import { FetchedBackLinkDataFromMarketplace } from '@/types/backlink.js';
import { MARKETPLACE_NAME_PAPERCLUB } from '@/global/strings.ts';
import { getBacklinksDataFromPaperclub } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/paperclub.ts';

/**
 * Fetch Paperclub data and process it using the marketplaceHandler
 */
export const fetchPaperclubEndpoint: Endpoint = {

  path: '/fetch-paperclub',

  method: 'get',

  handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

    // Wrap fetchData in a function to match the expected signature
    const fetchData = async (): Promise<FetchedBackLinkDataFromMarketplace[]> => {

      const data = await getBacklinksDataFromPaperclub();

      if (Array.isArray(data)) {

        return data; // Return the array of data

      } else {

        // Handle the case where data is not an array, return empty array or handle the error
        return [];

      }

    };

    const marketplaceName = MARKETPLACE_NAME_PAPERCLUB; // Marketplace name for Paperclub

    // Call marketplaceHandler with the required parameters
    return marketplaceHandler(req, fetchData, marketplaceName);

  })

};

