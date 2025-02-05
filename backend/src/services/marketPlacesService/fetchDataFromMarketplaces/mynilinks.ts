import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { getFormDataFromMynilinks } from '../formattingFetchedDataFromMarketplaces/mynilinks.ts';

export const fetchDataFromMynilinks = async (url: string, cookie: string) => {
    try {
        const response = await axiosInstance.get(url, {
            headers: {
                Cookie: cookie,
            },
        });

        const fomatedData = getFormDataFromMynilinks(response.data);
        return fomatedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Mynilinks data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
