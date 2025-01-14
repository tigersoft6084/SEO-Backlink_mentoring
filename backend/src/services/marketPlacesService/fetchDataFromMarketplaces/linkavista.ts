import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromLinkavistar } from '../formattingFetchedDataFromMarketplaces/linkavista.ts';

export const fetchDataFromLinkavistar = async (url: string, cookie: string) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Cookie: cookie,
      },
    });

    const fomatedData = getFormDataFromLinkavistar(response.data);
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
