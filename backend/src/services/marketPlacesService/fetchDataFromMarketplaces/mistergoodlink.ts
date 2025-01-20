import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromMistergoodlink } from '../formattingFetchedDataFromMarketplaces/mistergoodlink.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

export const fetchDataFromMistergoodlink = async (url: string, cookie: string) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Cookie: cookie,
      },
    });

    const script = getFormDataFromMistergoodlink(response.data);
    return script;
  } catch (error) {
    const { errorDetails, status } = ErrorHandler.handle(error, "No Mistergoodlink data received.");
    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
