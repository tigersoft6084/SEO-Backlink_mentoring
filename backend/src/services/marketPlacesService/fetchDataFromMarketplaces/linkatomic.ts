import { axiosInstance } from '@/utils/axiosInstance.ts';
// import { getFormDataFromLinkatomic } from '../formattingFetchedDataFromMarketplaces/linkavista.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { getFormDataFromLinkatomic } from '../formattingFetchedDataFromMarketplaces/linkatomic.ts';

export const fetchDataFromLinkatomic = async (url: string, cookie: string) => {
    try {
        const response = await axiosInstance.get(url, {
            headers: {
                Cookie: cookie,
            },
        });

        const fomatedData = getFormDataFromLinkatomic(response.data, cookie);
        return fomatedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Linkatomic data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
