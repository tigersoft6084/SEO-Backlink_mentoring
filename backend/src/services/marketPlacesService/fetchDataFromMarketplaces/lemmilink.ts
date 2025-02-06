
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromLemmilink } from '../formattingFetchedDataFromMarketplaces/lemmilink.ts';

export const fetchDataFromLemmilink = async (url: string, tokenAndId: {access_token : string, user_id : string}) => {
    try {
        const response = await axiosInstance.get(url, {
        headers: {
            Authorization: `Bearer ${tokenAndId.access_token}`,
            "user-id" : tokenAndId.user_id
        },
        });
        const formattedData = getFormDataFromLemmilink(response.data);
        return formattedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Lemmilink data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
