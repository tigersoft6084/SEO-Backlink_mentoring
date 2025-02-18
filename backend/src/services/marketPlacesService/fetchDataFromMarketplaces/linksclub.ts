import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { getFormDataFromLinksclub } from '../formattingFetchedDataFromMarketplaces/linksclub.ts';

export const fetchDataFromLinksclub = async (url: string, cookie: string) => {

    const formData = new URLSearchParams();
    formData.append('filtre-groupe', 'all');
    formData.append('url', 'https://www.cnet.com');

    try {
        const response = await axiosInstance.post(url, formData.toString(), {
            headers: {
                Cookie: cookie,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Upgrade-Insecure-Requests' : '1'
            },
        });
        const formattedData = getFormDataFromLinksclub(response.data);
        return formattedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, `No Linksclub data received.`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
