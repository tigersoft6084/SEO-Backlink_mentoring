import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance';
import { getFormDataFromDevelink } from '../formattingFetchedDataFromMarketplaces/develink';

export const fetchDataFromDevelink = async (url: string, cookie: string) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Cookie: cookie,
      },
    });
    const formattedData = getFormDataFromDevelink(response.data);
    return formattedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch URL:', error.message);
    } else {
      console.error('Failed to fetch URL:', error);
    }
    return []; // Return empty array in case of failure
  }
};
