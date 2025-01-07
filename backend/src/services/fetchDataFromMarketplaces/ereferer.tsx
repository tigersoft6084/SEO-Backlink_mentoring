import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance';
import { getFormDataFromEreferer } from '../formattingFetchedDataFromMarketplaces/ereferer';

export const fetchDataFromEreferer = async (url: string, cookie: string) => {
  try {
    const response = await axiosInstance.post(url, {}, {
      headers: {
        Cookie: cookie,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const script = getFormDataFromEreferer(response.data);
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
