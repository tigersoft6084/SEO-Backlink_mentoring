// endpoints/fetchSerp.ts
import { Endpoint } from 'payload';
import { fetchSerpData } from '../services/serpService';

export const fetchSerpEndpoint: Endpoint = {
    path: '/fetch-serp',  // Endpoint path
    method: 'post',       // HTTP method (POST in this case)
    handler: async (Request: any) => {
      try {
        // Parse the body
        const body = await Request.json(); // Assuming `Request` is the Fetch API request object
  
        const { keyword, locationCode, languageCode, depth } = body;
  
        // Input validation
        if (!keyword || !locationCode || !languageCode || !depth) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
  
        // Fetch SERP data
        const serpData = await fetchSerpData(keyword, locationCode, languageCode, depth);
  
        // // Optionally, save the result to Payload CMS (not mandatory, adjust as needed)
        // const createdSerpRequest = await Request.payload.create({
        //   collection: 'serpRequests',
        //   data: {
        //     keyword,
        //     locationCode,
        //     languageCode,
        //     depth,
        //     serpResults: serpData,
        //   },
        // });
  
        return new Response(
          JSON.stringify({ serpResults: serpData }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        console.error('Error fetching SERP data:', error);
  
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    },
  };
  
