import axios from 'axios';
import { BASE_URL, API_KEY } from '../config/apiConfig';

// Fetch marketPlaces
export const getMarketPlaces = async (): Promise<{ name: string; website: string }[]> => {
  if (!API_KEY || !BASE_URL) {
    throw new Error('API_KEY or BASE_URL is missing in environment variables.');
  }

  try {
    const response = await axios.get(`${BASE_URL}/websiteForScraping`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const marketPlaces = response.data.docs; // Assuming `docs` is an array
    if (!Array.isArray(marketPlaces) || marketPlaces.length === 0) {
      throw new Error('No marketplaces found or invalid response format.');
    }

    // Map the array to extract name and website for each marketplace
    return marketPlaces.map((marketPlace: { name: string; website: string }) => {
      if (!marketPlace.name || !marketPlace.website) {
        throw new Error('Missing name or website in marketplace data.');
      }
      return { name: marketPlace.name, website: marketPlace.website };
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios Error:',
        error.response?.status,
        error.response?.data || error.message
      );
    } else {
      console.error('Error fetching marketplaces:', error.message);
    }
    throw new Error('Failed to fetch marketplaces from the server.');
  }
};
