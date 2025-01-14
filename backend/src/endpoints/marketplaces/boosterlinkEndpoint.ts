

import { getBacklinksDataFromBoosterlink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/boosterlink.ts';
import { Endpoint } from 'payload';

export const fetchBoosterlinkEndpoint: Endpoint = {
  path: '/fetch-boosterlink',
  method: 'get',
  handler: async ({ payload }) => {
    try {
      // Fetch the BoosterlinkData
      const BoosterlinkData = await getBacklinksDataFromBoosterlink();

      if (!Array.isArray(BoosterlinkData) || BoosterlinkData.length === 0) {
        return new Response(
          JSON.stringify({
            message: 'No BoosterlinkData found.',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const totalItems = BoosterlinkData.length;
      let processedItems = 0; // Track the number of processed items

      const savePromises = BoosterlinkData.map(async (item) => {
        // Ensure the numeric fields are properly parsed
        const title = String(item.title);
        const TF = Number(item.tf);
        const price = Number(item.price);

        // Validate that the conversion was successful
        if (isNaN(TF) || isNaN(price)) {
          throw new Error(
            `Invalid data received: TF=${item.tf}, price=${item.price}`
          );
        }

        // Check if the domain with the same source already exists
        const existingEntry = await payload.find({
          collection: 'backlinks',
          where: {
            domain: {
              equals: item.domain,
            },
            source: {
              equals: 'Boosterlink', // Match the hardcoded source
            },
          },
        });

        if (existingEntry && existingEntry.totalDocs > 0) {
          // Update the existing entry
          const entryToUpdate = existingEntry.docs[0];
          await payload.update({
            collection: 'backlinks',
            id: entryToUpdate.id,
            data: {
              TF, // Update Trust Flow
              price, // Update price
              dateFetched: new Date().toISOString(), // Update fetch date
            },
          });
        } else {
          // Create a new entry
          await payload.create({
            collection: 'backlinks',
            data: {
              domain: item.domain,
              TF,
              price,
              Title: title,
              source: 'Boosterlink', // Hardcoded source for Boosterlink
              dateFetched: new Date().toISOString(), // Current date
            },
          });
        }

        // Increment the processed items count
        processedItems += 1;

        // Calculate the progress percentage
        const progress = Math.round((processedItems / totalItems) * 100);

        // Log progress to the console (or send it to the client if needed)
        console.log(`Progress: ${progress}%`);
        // You can implement additional logic to send the progress back to the client (e.g., through a WebSocket or in a custom API response)
      });

      // Wait for all save operations to complete
      await Promise.all(savePromises);

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          results: BoosterlinkData,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error: any) {
      console.error('Error occurred while fetching:', error);

      return new Response(
        JSON.stringify({
          message: 'An error occurred while fetching data.',
          error: error.message || 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
