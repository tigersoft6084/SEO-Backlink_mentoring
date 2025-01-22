import { axiosInstance } from '@/utils/axiosInstance.ts';

import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { getFormDataFromDevelink } from '../formattingFetchedDataFromMarketplaces/develink.ts';

export const fetchDataFromDevelink = async (url: string, cookie: string) => {
    try {
      const response = await axiosInstance.get(url, {
        headers: {
        Cookie: cookie,
      },
    });

    const formattedData = getFormDataFromDevelink(response.data);

    return formattedData;

  } catch (error) {

    const { errorDetails, status } = ErrorHandler.handle(error, `No Develink data received.`);

    return new Response(JSON.stringify(errorDetails), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
};
