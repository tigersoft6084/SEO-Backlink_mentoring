import axios from 'axios';
import { Publisher } from '../models/publisher';
import { BASE_URL, API_KEY } from '../config/apiConfig';

export const sendDataToPayload = async (data: Publisher[]): Promise<void> => {
  try {

    // Validate API_KEY
    if (!API_KEY) {
        throw new Error('API_KEY is not defined. Please ensure it is set in your environment variables.');
    }
        
    const response = await axios.post(`${BASE_URL}/publishers`, data, {
      headers: {
        Authorization: `Bearer ${API_KEY}`, 
      },
    });

    console.log('Data successfully sent to Payload:', response.data);

  } catch (error: unknown) {
    // Check if the error is an AxiosError
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      // Generic error
      console.error('Error:', error.message);
    } else {
      // Unknown error
      console.error('Unknown error occurred:', error);
    }
    throw new Error('Failed to send data to Payload CMS.');
  }
};
