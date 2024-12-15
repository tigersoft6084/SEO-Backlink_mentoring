import axios from 'axios';
import { Publisher } from '../models/publisher';
import { BASE_URL, API_KEY } from '../config/apiConfig';

export const sendDataToPayload = async (data: Publisher[]): Promise<void> => {
  if (!API_KEY) {
    throw new Error('API_KEY is not defined. Please ensure it is set in your environment variables.');
  }

  try {
    // Validate the input data
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data is empty or invalid.');
    }

    const response = await axios.post(`${BASE_URL}/publishers`, data, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log('Data successfully sent to Payload:', response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error occurred:', error);
    }

    throw new Error('Failed to send data to Payload CMS.');
  }
};
