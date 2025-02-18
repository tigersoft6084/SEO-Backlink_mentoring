import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { getFormDataFromLinkbroker } from '../formattingFetchedDataFromMarketplaces/linkbroker.ts';

export const fetchDataFromLinkbroker = async (url: string, token: string, page : number) => {

    const body = {
        "page": page,
        "pageSize": 20,
        "project": null,
        "lang": "de",
        "search": "",
        "categories": [],
        "explicitCategories": [],
        "countries": [],
        "languages": [],
        "trends": [],
        "tlds": [],
        "statFilters": [
            {
                "key": "DR",
                "min": null,
                "max": null
            },
            {
                "key": "DA",
                "min": null,
                "max": null
            },
            {
                "key": "SI",
                "min": null,
                "max": null
            },
            {
                "key": "RD",
                "min": null,
                "max": null
            },
            {
                "key": "TRAFFIC",
                "min": null,
                "max": null
            },
            {
                "key": "LD",
                "min": null,
                "max": null
            },
            {
                "key": "SS",
                "min": null,
                "max": null
            },
            {
                "key": "RL_RATIO",
                "min": null,
                "max": null
            }
        ],
        "priceRange": {
            "min": null,
            "max": null
        },
        "sortColumn": "DEFAULT",
        "sortDirection": "DESC",
        "showFavorites": false,
        "section": "ALL"
    }

    try {
        const response = await axiosInstance.post(url, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
        });
        const formattedData = getFormDataFromLinkbroker(response.data);
        return formattedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Linkbroker data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
