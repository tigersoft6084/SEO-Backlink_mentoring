// import { getBacklinksDataFromLinkaVista } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/linkavista.ts';
// import { Endpoint } from 'payload';


// export const fetchLinkavistarEndpoint: Endpoint = {
//   path: '/fetch-linkavistar',
//   method: 'get',
//   handler: async ({ payload }) => {
//     try {
//       // Fetch the LinkavistarData
//       const linkavistar = await getBacklinksDataFromLinkaVista();

//       if (!Array.isArray(linkavistar) || linkavistar.length === 0) {
//         return new Response(
//           JSON.stringify({
//             message: 'No LinkavistarData found.',
//           }),
//           {
//             status: 404,
//             headers: { 'Content-Type': 'application/json' },
//           }
//         );
//       }

//       const totalRecords = linkavistar.length;
//       let processedRecords = 0;

//       const savePromises = linkavistar.map(async (item) => {
//         // Ensure the numeric fields are properly parsed
//         const RD = Number(item.rd);
//         const TF = Number(item.tf);
//         const CF = Number(item.cf);
//         const TTF = String(item.ttf);
//         const price = Number(item.price);

//         // Validate that the conversion was successful
//         if (isNaN(RD) || isNaN(TF) || isNaN(CF) || isNaN(price)) {
//           throw new Error(
//             `Invalid data received: RD=${item.rd}, TF=${item.tf}, CF=${item.cf}, price=${item.price}`
//           );
//         }

//         // Check if the domain with the same source already exists
//         const existingEntry = await payload.find({
//           collection: 'backlinks',
//           where: {
//             domain: {
//               equals: item.domain,
//             },
//             source: {
//               equals: 'Linkavistar', // Match the hardcoded source
//             },
//           },
//         });

//         if (existingEntry && existingEntry.totalDocs > 0) {
//           // Update the existing entry
//           const entryToUpdate = existingEntry.docs[0];
//           await payload.update({
//             collection: 'backlinks',
//             id: entryToUpdate.id,
//             data: {
//               RD, // Update Referring Domains
//               TF, // Update Trust Flow
//               CF, // Update Citation Flow
//               price, // Update price
//               TTF,
//               dateFetched: new Date().toISOString(), // Update fetch date
//             },
//           });
//         } else {
//           // Create a new entry
//           await payload.create({
//             collection: 'backlinks',
//             data: {
//               domain: item.domain,
//               RD,
//               TF,
//               CF,
//               price,
//               TTF,
//               source: 'Linkavistar', // Hardcoded source for Linkavistar
//               dateFetched: new Date().toISOString(), // Current date
//             },
//           });
//         }

//         // Update progress
//         processedRecords += 1;
//         const progressPercentage = ((processedRecords / totalRecords) * 100).toFixed(2);
//         console.log(`Upload progress: ${progressPercentage}%`);
//       });

//       // Wait for all save operations to complete
//       await Promise.all(savePromises);

//       // Return the collected results
//       return new Response(
//         JSON.stringify({
//           message: 'Fetch completed.',
//           results: linkavistar,
//         }),
//         {
//           status: 200,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     } catch (error: any) {
//       console.error('Error occurred while fetching:', error);

//       return new Response(
//         JSON.stringify({
//           message: 'An error occurred while fetching data.',
//           error: error.message || 'Unknown error',
//         }),
//         {
//           status: 500,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }
//   },
// };


import { Endpoint, PayloadRequest } from 'payload';
import { withErrorHandling } from '@/middleware/errorMiddleware.ts';
import { marketplaceHandler } from '@/handlers/marketplaceHandler.ts';
import { FetchedBackLinkDataFromMarketplace } from '@/types/backlink.js';
import { MARKETPLACE_NAME_LINKAVISTAR } from '@/globals/strings.ts';
import { getBacklinksDataFromLinkaVista } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/linkavista.ts';

/**
 * Fetch Linkavistar data and process it using the marketplaceHandler
 */
export const fetchLinkavistarEndpoint: Endpoint = {

  path: '/fetch-linkavistar',

  method: 'get',

  handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

    // Wrap fetchData in a function to match the expected signature
    const fetchData = async (): Promise<FetchedBackLinkDataFromMarketplace[]> => {

      const data = await getBacklinksDataFromLinkaVista();

      if (Array.isArray(data)) {

        return data; // Return the array of data

      } else {

        // Handle the case where data is not an array, return empty array or handle the error
        return [];

      }

    };

    const marketplaceName = MARKETPLACE_NAME_LINKAVISTAR; // Marketplace name for Boosterlink

    // Call marketplaceHandler with the required parameters
    return marketplaceHandler(req, fetchData, marketplaceName);

  })

};
