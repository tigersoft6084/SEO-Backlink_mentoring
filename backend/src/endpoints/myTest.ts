import axios, { AxiosResponse } from 'axios';
import { Endpoint } from 'payload';
import { startWhoisProcessing } from '@/services/whoiserService';

// Define the structure of the post data
interface PostData {
  location_code: number;
  keywords: string[];
  date_from: string;
  search_partners: boolean;
}

// Define the structure of the API response
interface ApiResponseTask {
  id: string;
  status_code: number;
  status_message: string;
  data: any;
}

interface ApiResponse {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: ApiResponseTask[];
}

// Function to fetch SEO data from DataForSeo
const fetchDataForSeo = async (): Promise<ApiResponseTask[] | null> => {
  const postArray: PostData[] = [
    {
      location_code: 2840,
      keywords: ["buy laptop", "cheap laptops for sale", "purchase laptop"],
      date_from: "2021-08-01",
      search_partners: true,
    },
  ];

  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(
      'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live',
      postArray,
      {
        auth: {
          username: 'hello@brownsone.com', // Replace with your actual username
          password: 'passwoSertu$12rd', // Replace with your actual password
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.tasks;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async ({ payload }) => {
    try {
      // Fetch WHOIS processing data
      //const whoisData = await startWhoisProcessing();

      // Fetch SEO data from DataForSeo
      const seoData = await fetchDataForSeo();

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          whoisResults: seoData,
          seoResults: seoData,
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
