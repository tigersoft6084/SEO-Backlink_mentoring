import { getBacklinksDataFromSeojungle } from '@/services/getBacklinksFromMarketplaces/seojungle';
import { Endpoint } from 'payload';

// Helper function to process data in batches and track progress
const processInBatches = async (
  data: any[],
  batchSize: number,
  payload: any,
  updateProgress: (progress: number) => void
) => {
  const totalItems = data.length;
  let processedItems = 0;

  for (let i = 0; i < totalItems; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const savePromises = batch.map(async (item) => {
      // Ensure the numeric fields are properly parsed
      const RD = Number(item.rd);
      const TF = Number(item.tf);
      const CF = Number(item.cf);
      const price = Number(item.price);

      // Validate the parsed data
      if (isNaN(RD) || isNaN(TF) || isNaN(CF) || isNaN(price)) {
        throw new Error(
          `Invalid data received: RD=${item.rd}, TF=${item.tf}, CF=${item.cf}, price=${item.price}`
        );
      }

      // Check if the domain with the same source already exists
      const existingEntry = await payload.find({
        collection: 'backlinks',
        where: {
          domain: { equals: item.domain },
          source: { equals: 'SeoJungle' },
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
            source: 'Seojungle', // Hardcoded source for SeoJungle
            dateFetched: new Date().toISOString(), // Current date
          },
        });
      }
    });

    // Wait for all operations in the current batch to complete
    await Promise.all(savePromises);

    // Update the progress
    processedItems += batch.length;
    const progress = Math.round((processedItems / totalItems) * 100);
    updateProgress(progress);
  }
};

// Main handler function
export const fetchSeoJungleEndpoint: Endpoint = {
  path: '/fetch-seojungle',
  method: 'get',
  handler: async ({ payload }) => {
    try {
      // Fetch the SeoJungleData
      const SeoJungleData = await getBacklinksDataFromSeojungle();

      if (!Array.isArray(SeoJungleData) || SeoJungleData.length === 0) {
        return new Response(
          JSON.stringify({ message: 'No SeoJungleData found.' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Process data in batches with progress tracking
      const batchSize = 500; // Adjust the batch size as needed

      // Function to log the progress
      const updateProgress = (progress: number) => {
        console.log(`Seojunlge database Upload Progress: ${progress}%`);
      };

      await processInBatches(SeoJungleData, batchSize, payload, updateProgress);

      return new Response(
        JSON.stringify({ message: 'Fetch completed successfully.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: unknown) {
      console.error('Error occurred while fetching:', error);

      return new Response(
        JSON.stringify({
          message: 'An error occurred while fetching data.',
          error: (error instanceof Error) ? error.message : 'Unknown error',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
