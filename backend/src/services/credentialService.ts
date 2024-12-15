import axios from 'axios';
import { BASE_URL, API_KEY } from '../config/apiConfig';

export const getCredentials = async (): Promise<{ email: string; password: string }> => {

  try {

    if (!API_KEY) {
      throw new Error('API key is missing in environment variables.');
    }

    const response = await axios.get(`${BASE_URL}/credentials`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

     // Log response for debugging
    console.log('Credentials response:', response.data);

    const credentials = response.data.docs[0]; // Assuming only one entry

    if (!credentials || !credentials.email || !credentials.password) {
        throw new Error('Invalid or missing credentials.');
    }

    return { email: credentials.email, password: credentials.password };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to fetch credentials from Payload CMS.');
  }
};
