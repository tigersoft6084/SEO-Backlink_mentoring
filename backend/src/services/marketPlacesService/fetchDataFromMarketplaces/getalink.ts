import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromGetalink } from '../formattingFetchedDataFromMarketplaces/getalink.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

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
    const { errorDetails, status } = ErrorHandler.handle(error, "No Getalink data received.");
    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
