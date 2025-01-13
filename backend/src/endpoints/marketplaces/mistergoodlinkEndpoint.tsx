import { getBacklinksDataFromMistergoodlink } from '@/services/getBacklinksFromMarketplaces/mistergoodlink';
import { Endpoint } from 'payload';

export const fetchMistergoodlinkEndpoint: Endpoint = {
  path: '/fetch-mistergoodlink',
  method: 'get',
  handler: async ({ payload }) => {
    try {
      // Fetch the MistergoodlinkData
      const mistergoodlinkData = await getBacklinksDataFromMistergoodlink();

      if (!Array.isArray(mistergoodlinkData) || mistergoodlinkData.length === 0) {
        return new Response(
          JSON.stringify({
            message: 'No MistergoodlinkData found.',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const totalItems = mistergoodlinkData.length;
      let processedCount = 0;

      // A function to calculate and log the progress
      const updateProgress = () => {
        processedCount += 1;
        const progressPercentage = ((processedCount / totalItems) * 100).toFixed(2);
        console.log(`Mistergoodlink database upload Progress: ${progressPercentage}%`);
      };

      const savePromises = mistergoodlinkData.map(async (item) => {
        // Ensure the numeric fields are properly parsed
        const RD = Number(item.rd);
        const TF = Number(item.tf);
        const CF = Number(item.cf);
        const price = Number(item.price);
        const lang = String(item.language);

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
              equals: item.url,
            },
            source: {
              equals: 'Mistergoodlink', // Match the hardcoded source
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
              Language: lang,
              dateFetched: new Date().toISOString(), // Update fetch date
            },
          });
        } else {
          // Create a new entry
          await payload.create({
            collection: 'backlinks',
            data: {
              domain: item.url,
              RD,
              TF,
              CF,
              price,
              Language: lang,
              source: 'Mistergoodlink', // Hardcoded source for Mistergoodlink
              dateFetched: new Date().toISOString(), // Current date
            },
          });
        }

        // Update progress after processing each item
        updateProgress();
      });

      // Wait for all save operations to complete
      await Promise.all(savePromises);

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          results: mistergoodlinkData,
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
