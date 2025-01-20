import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromLinkavistar } from '../formattingFetchedDataFromMarketplaces/linkavista.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

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
    const { errorDetails, status } = ErrorHandler.handle(error, "No Linkavistar data received.");
    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
