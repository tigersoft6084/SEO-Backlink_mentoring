

import { getBacklinksDataFromPaperclub } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/paperclub.ts';
import { Endpoint } from 'payload';

export const fetchPaperclubEndpoint: Endpoint = {
  path: '/fetch-paperclub',
  method: 'get',
  handler: async ({ payload }) => {
    try {
      // Fetch the paperclubData
      const paperclubData = await getBacklinksDataFromPaperclub();

      if (!Array.isArray(paperclubData) || paperclubData.length === 0) {
        return new Response(
          JSON.stringify({
            message: 'No paperclubData found.',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Flatten the nested array (if necessary)
      const flattenedData = paperclubData.flat();
      const totalItems = flattenedData.length;
      let processedItems = 0;

      console.log(`Starting upload of ${totalItems} items...`);

      // Batch the save operations to avoid overloading
      const batchSize = 100; // Adjust batch size based on system capacity
      const batches = [];

      for (let i = 0; i < totalItems; i += batchSize) {
        batches.push(flattenedData.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        await Promise.all(
          batch.map(async (item: any) => {
            if (!item) {
              throw new Error('Received null or undefined item.');
            }

            const RD = Number(item.rd);
            const TF = Number(item.tf);
            const CF = Number(item.cf);
            const price = Number(item.price);

            if (isNaN(RD) || isNaN(TF) || isNaN(CF) || isNaN(price)) {
              throw new Error(
                `Invalid data received: RD=${item.rd}, TF=${item.tf}, CF=${item.cf}, price=${item.price}`
              );
            }

            const existingEntry = await payload.find({
              collection: 'backlinks',
              where: {
                domain: {
                  equals: item.domain,
                },
                source: {
                  equals: 'Paperclub',
                },
              },
            });

            if (existingEntry && existingEntry.totalDocs > 0) {
              const entryToUpdate = existingEntry.docs[0];
              await payload.update({
                collection: 'backlinks',
                id: entryToUpdate.id,
                data: {
                  RD,
                  TF,
                  CF,
                  price,
                  dateFetched: new Date().toISOString(),
                },
              });
            } else {
              await payload.create({
                collection: 'backlinks',
                data: {
                  domain: item.domain,
                  RD,
                  TF,
                  CF,
                  price,
                  source: 'Paperclub',
                  dateFetched: new Date().toISOString(),
                },
              });
            }

            processedItems++;
            const progressPercentage = ((processedItems / totalItems) * 100).toFixed(2);
            console.log(
              `Database Progress: ${progressPercentage}% (${processedItems}/${totalItems})`
            );
          })
        );
      }

      return new Response(
        JSON.stringify({
          message: 'Fetch completed successfully.',
          processed: processedItems,
          total: totalItems,
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

