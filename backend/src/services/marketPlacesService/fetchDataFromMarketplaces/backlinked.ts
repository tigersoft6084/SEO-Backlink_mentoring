import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { getFormDataFromBacklinked } from '../formattingFetchedDataFromMarketplaces/backlinked.ts';

export const fetchDataFromBacklinked = async (url: string, page : number, validationData: { X_XSRF_TOKEN: string; COOKIE: string }) => {

    const body = {
        "favorites": false,
        "relationship_attribute": null,
        "sponsored_mark": null,
        "offensive_content": null,
        "sorting": {
            "order_by": "",
            "order_asc": false
        },
        "search": "",
        "page": page,
        "categories": [],
        "languages": [],
        "tlds": [],
        "favorites_lists": [],
        "price_recently_reduced": false,
        "new_links": false,
        "trusted_publishers": false,
        "range_filters": {
            "sistrix_sichtbarkeitsindex": {
                "limit_min": 0,
                "limit_max": 20
            },
            "ahrefs_referring_domains": {
                "limit_min": 0,
                "limit_max": 50000
            },
            "ahrefs_traffic": {
                "limit_min": 0,
                "limit_max": 10000000
            },
            "majestic_trust_flow": {
                "limit_min": 0,
                "limit_max": 87
            },
            "ahrefs_domain_rating": {
                "limit_min": 0,
                "limit_max": 100
            },
            "moz_domain_authority": {
                "limit_min": 0,
                "limit_max": 95
            },
            "price": {
                "limit_min": 100,
                "limit_max": 2000
            },
            "semrush_authority_score": {
                "limit_min": 0,
                "limit_max": 100
            }
        },
        "qualityLinksOnly": true
    }

    try {

        const response = await axiosInstance.post(url, body, {
            headers: {
                Cookie: validationData.COOKIE,
                'X-XSRF-TOKEN' : validationData.X_XSRF_TOKEN,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Host: 'app.backlinked.com',
                "Referer": "https://app.backlinked.com/marketplace/contentlinks",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
        });

        const fomatedData = getFormDataFromBacklinked(response.data);
        return fomatedData;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Backlinked data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
