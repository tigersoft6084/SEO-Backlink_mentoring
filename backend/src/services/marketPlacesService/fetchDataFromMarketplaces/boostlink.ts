import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromBoosterlink } from '../formattingFetchedDataFromMarketplaces/boosterlink.ts';

export const fetchDataFromBoosterlink = async (url: string, cookie: string) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Cookie: cookie,
        'host': 'pro.boosterlink.fr',
      },
    });
    const fomatedData = getFormDataFromBoosterlink(response.data);
    return fomatedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch URL:', error.message);
    } else {
      console.error('Failed to fetch URL:', error);
    }
    return []; // Return empty array in case of failure
  }
};
