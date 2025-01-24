import { axiosInstance } from '@/utils/axiosInstance.ts';
import { getFormDataFromSeojungle } from '../formattingFetchedDataFromMarketplaces/seojungle.ts';
import { GET_BACKLINK_FROM_SeoJungle_URL } from '@/globals/globalURLs.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

export const fetchDataFromSeojungle = async (token: string, page: number, themes: string[]) => {

    const body = {
        searchField: "",
        tfMin: 0,
        tfMax: 100,
        cfMin: 0,
        cfMax: 100,
        priceMin: 0,
        priceMax: null,
        themes,
        targetCountries: [],
        linkType: "all",
        waybackDomainAgeMin: 0,
        waybackDomainAgeMax: 2147483647,
        whoisCreationDateMin: 0,
        whoisCreationDateMax: 2147483647,
        numberOfWords: 0,
        majesticTotalBacklinksMin: 0,
        majesticTotalBacklinksMax: 2147483647,
        majesticReferringDomainsMin: 0,
        majesticReferringDomainsMax: 2147483647,
        semrushNumberOfKeywordsMin: 0,
        semrushNumberOfKeywordsMax: 2147483647,
        semrushTrafficOrganicMin: 0,
        semrushTrafficOrganicMax: 2147483647,
        page,
        private: false,
        orders: [{ sort: "desc", colId: "organicTraffic" }],
    };

    try {
        const response = await axiosInstance.post(GET_BACKLINK_FROM_SeoJungle_URL, body, {
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Organization-Id": "2f26d1f1-c44e-4b92-b03e-7121b018ae91",
                Referer: "https://app.Seojungle.com/"
            },
        });

        const formattedData = getFormDataFromSeojungle(response);

        return formattedData;

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Seojungle data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
