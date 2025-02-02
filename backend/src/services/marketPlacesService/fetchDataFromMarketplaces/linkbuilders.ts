import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { getFormDataFromLinkbuilders } from '../formattingFetchedDataFromMarketplaces/linkbuilders.ts';

export const fetchDataFromLinkbuilders = async (url: string, token: string) => {
    try {
        const response = await axiosInstance.get(url, {
            headers: {
                Cookie: `__Host-access-token=${token}; Path=/; Secure; HttpOnly;`,
            },
        });
        const formattedData = getFormDataFromLinkbuilders(response.data);
        return formattedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Linkbuilders data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
