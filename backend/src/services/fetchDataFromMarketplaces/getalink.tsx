import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance';
import { getFormDataFromGetalink } from '../formattingFetchedDataFromMarketplaces/getalink';

export const fetchDataFromGetalink = async (url: string, token: string) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}` 
      },
    });
    const fomatedData = getFormDataFromGetalink(response.data);
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
