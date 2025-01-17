import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromEreferer } from '../formattingFetchedDataFromMarketplaces/ereferer.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

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
    const { errorDetails, status } = ErrorHandler.handle(error, `No Ereferer data received.`);
    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
