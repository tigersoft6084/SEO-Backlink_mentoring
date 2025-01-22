import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromLinkavistar } from '../formattingFetchedDataFromMarketplaces/linkavista.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { Payload } from 'payload';

export const fetchDataFromLinkavistar = async (url: string, cookie: string, payload : Payload) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Cookie: cookie,
      },
    });

    const fomatedData = getFormDataFromLinkavistar(response.data, payload);
    return fomatedData;
  } catch (error) {
    const { errorDetails, status } = ErrorHandler.handle(error, "No Linkavistar data received.");
    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
