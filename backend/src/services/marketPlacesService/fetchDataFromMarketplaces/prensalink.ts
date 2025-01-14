import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromPrensalink } from '../formattingFetchedDataFromMarketplaces/presnalink.ts';

export const fetchDataFromPrensalink = async (url: string, token: string) => {

    try {

        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                timeout: 30000, // Set timeout to 30 seconds
            },
        });

        const formattedData = getFormDataFromPrensalink(response.data.items);
        return formattedData;

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error('Failed to fetch URL:', error.message);
        } else {
            console.error('Failed to fetch URL:', error);
        }

        return []; // Return empty array in case of failure
    }
};
