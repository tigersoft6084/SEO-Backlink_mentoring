import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromBoosterlink } from '../formattingFetchedDataFromMarketplaces/boosterlink.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

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
      const { errorDetails, status } = ErrorHandler.handle(error, "No Boosterlink data received.");
      return new Response(JSON.stringify(errorDetails), {
          status,
          headers: { "Content-Type": "application/json" },
      });
  }
};
