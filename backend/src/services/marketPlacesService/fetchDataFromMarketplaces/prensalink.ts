import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromPrensalink } from '../formattingFetchedDataFromMarketplaces/presnalink.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

export const fetchDataFromPrensalink = async (url: string, token: string) => {

    try {

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const formattedData = getFormDataFromPrensalink(response.data.items);
        return formattedData;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Prensalink data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
