import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromMistergoodlink } from '../formattingFetchedDataFromMarketplaces/mistergoodlink.ts';

export const fetchDataFromMistergoodlink = async (url: string, cookie: string) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Cookie: cookie,
      },
    });
    const script = getFormDataFromMistergoodlink(response.data);
    return script;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch URL:', error.message);
    } else {
      console.error('Failed to fetch URL:', error);
    }
    return []; // Return empty array in case of failure
  }
};
