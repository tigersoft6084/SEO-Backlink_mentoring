import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromPaperclub } from '../formattingFetchedDataFromMarketplaces/paperclub.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

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
    const { errorDetails, status } = ErrorHandler.handle(error, "No Paperclub data received.");
    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
