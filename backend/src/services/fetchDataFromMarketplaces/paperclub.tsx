import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance';
import { getFormDataFromPaperclub } from '../formattingFetchedDataFromMarketplaces/paperclub';

export const fetchDataFromPaperclub = async (url: string, token: string) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    const formattedData = getFormDataFromPaperclub(response.data);
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
