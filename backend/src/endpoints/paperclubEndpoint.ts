import { getPaperclubData } from '@/services/getBacklinks/paperClub';
import { Endpoint } from 'payload';


export const fetchPaperclubEndpoint: Endpoint = {
  path: '/fetch-paperclub',
  method: 'get',
  handler: async ({payload}) => {
    try {
      // Fetch the paperclubData
      const paperclubData = await getPaperclubData();

      if (!Array.isArray(paperclubData) || paperclubData.length === 0) {
        return new Response(JSON.stringify({
          message: 'No paperclubData found.',
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }


        const savePromises = paperclubData.map((item) => {
        // Ensure the numeric fields are properly parsed
        const RD = Number(item.rd); // Convert to number
        const TF = Number(item.tf);
        const CF = Number(item.cf);
        const price = Number(item.price);

        // Validate that the conversion was successful
        if (isNaN(RD) || isNaN(TF) || isNaN(CF) || isNaN(price)) {
          throw new Error(
            `Invalid data received: RD=${item.rd}, TF=${item.tf}, CF=${item.cf}, price=${item.price}`
          );
        }

        return payload.create({
          collection: 'backlinks',
          data: {
            domain: item.domain,
            RD, // Referring Domains
            TF, // Trust Flow
            CF, // Citation Flow
            price,
            source: 'paper_club', // Hardcoded source for Paper Club
            dateFetched: new Date().toISOString(), // Current date
          },
        });
      });

      // Wait for all save operations to complete
      await Promise.all(savePromises);

      
      // Return the collected results
      return new Response(JSON.stringify({
        message: 'Fetch completed.',
        results: paperclubData,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Error occurred while fetching:', error);

      return new Response(JSON.stringify({
        message: 'An error occurred while fetching data.',
        error: error.message || 'Unknown error',
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
