
import { getBacklinksDataFromPrensalink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/prensalink.ts';
import { Endpoint } from 'payload';

export const fetchprensalinkEndpoint: Endpoint = {
  path: '/fetch-prensalink',
  method: 'get',
  handler: async ({ payload }) => {
    try {
      // Fetch the prensalinkData
      const prensalinkData = await getBacklinksDataFromPrensalink();

      if (!Array.isArray(prensalinkData) || prensalinkData.length === 0) {
        return new Response(
          JSON.stringify({
            message: 'No prensalinkData found.',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Initialize a progress variable
      let progress = 0;
      const totalItems = prensalinkData.length;

      // A function to calculate and log progress
      const updateProgress = () => {
        progress += 1;
        const percentage = ((progress / totalItems) * 100).toFixed(2);
        console.log(`Progress: ${percentage}%`);
      };

      const savePromises = prensalinkData.map(async (item) => {
        // Ensure the item is not null
        if (!item) {
          throw new Error('Received null item');
        }

        // Ensure the numeric fields are properly parsed
        const RD = Number(item.rd);
        const TF = Number(item.tf);
        const CF = Number(item.cf);
        const price = Number(item.price);

        // Validate that the conversion was successful
        if (isNaN(RD) || isNaN(TF) || isNaN(CF) || isNaN(price)) {
          throw new Error(
            `Invalid data received: RD=${item.rd}, TF=${item.tf}, CF=${item.cf}, price=${item.price}`
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
              equals: 'prensalink', // Match the hardcoded source
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
              RD, // Update Referring Domains
              TF, // Update Trust Flow
              CF, // Update Citation Flow
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
              RD,
              TF,
              CF,
              price,
              source: 'Prensalink', // Hardcoded source for Paper Club
              dateFetched: new Date().toISOString(), // Current date
            },
          });
        }

        // Update the progress after each item is processed
        updateProgress();
      });

      // Wait for all save operations to complete
      await Promise.all(savePromises);

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          results: prensalinkData,
          progress: `${((progress / totalItems) * 100).toFixed(2)}%`, // Send the progress as part of the response
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
