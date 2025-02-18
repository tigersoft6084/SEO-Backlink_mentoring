import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import FormData from 'form-data';

export const fetchDataFromPresswhizz = async (
    url: string,
    finalTokenAndCookie: {
        token: string,
        COOKIE: string,
        csrfToken: string,
        baggageValue: string,
        sentryTraceValue: string,
        checksum: string,
        attributes: {
            'id': string
        },
        children: Record<string, { fingerprint: string; tag: string }>
    },
) => {
    try {

        // Create FormData object
        const formData = new FormData();

        const body = {
            "props": {
                "showModal": false,
                "modalSize": "small",
                "modalType": null,
                "modalData": null,
                "page": 2,
                "perPage": 25,
                "sortBy": "default_sort",
                "dir": "desc",
                "portalName": null,
                "language": "",
                "country": "",
                "mainCategory": "",
                "specialCategory": "",
                "ahrefsDomainRatingMin": null,
                "ahrefsDomainRatingMax": null,
                "mozDomainAuthorityMin": null,
                "mozDomainAuthorityMax": null,
                "domainAgeYears": "null",
                "offerMinPriceUSD": null,
                "offerMaxPriceUSD": null,
                "projectDomainId": "",
                "projectDomain": "",
                "keywordSearchTerm": null,
                "domains": [],
                "offerTypesFilter": "all",
                "formName": "marketplace_columns",
                "marketplace_columns": {
                    "country": "1",
                    "language": "1",
                    "mainCategory": "1",
                    "tags": "1",
                    "dr": "1",
                    "organicTraffic": "1",
                    "da": "1",
                    "pa": "1",
                    "spamScore": "1",
                    "age": "1",
                    "cheapestOffer": "1",
                    "_token": finalTokenAndCookie.token
                },
                "@attributes": finalTokenAndCookie.attributes,
                "@checksum": finalTokenAndCookie.checksum
            },
            "updated": {},
            "children": finalTokenAndCookie.children,
            "args": {
                "page": 2,
                "perPage": 25
            }
        };

        formData.append("data", JSON.stringify(body));

        // const response = await axiosInstance.post(url, formData, {
        //     headers: {
        //         ...formData.getHeaders(),
        //         'X-CSRF-TOKEN': finalTokenAndCookie.csrfToken,
        //         'X-Requested-With': 'XMLHttpRequest',
        //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        //         'baggage': finalTokenAndCookie.baggageValue,
        //         'sentry-trace': finalTokenAndCookie.sentryTraceValue,
        //         'Cookie': finalTokenAndCookie.COOKIE,
        //         'Accept': 'application/vnd.live-component+html',
        //         'host': 'app.presswhizz.com',
        //         'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        //         'sec-ch-ua-mobile': '?0',
        //         'Sec-Fetch-Site': 'same-origin',
        //         'sec-ch-ua-platform': '"Windows"',
        //         'Sec-Fetch-Mode': 'cors',
        //         'Sec-Fetch-Dest': 'empty',
        //         "Referer": "https://app.presswhizz.com/marketplace",
        //         "Referrer-Policy": "same-origin",
        //     }
        // });


        // const response = await axiosInstance.get("https://app.presswhizz.com/marketplace?page=1&perPage=100&sortBy=default_sort&dir=desc&portalName=&language=&country=&mainCategory=&specialCategory=&ahrefsDomainRatingMin=&ahrefsDomainRatingMax=&ahrefsOrganicTrafficMin=&ahrefsOrganicTrafficMax=&ahrefsOrganicKeywordsMin=&ahrefsOrganicKeywordsMax=&ahrefsReferringDomainsMin=&ahrefsReferringDomainsMax=&mozDomainAuthorityMin=&mozDomainAuthorityMax=&mozPageAuthorityMin=&mozPageAuthorityMax=&mozLinkingDomainsMin=&mozLinkingDomainsMax=&mozLinkPropensityMin=&mozLinkPropensityMax=&mozSpamScoreMin=&mozSpamScoreMax=&domainAgeYears=null&offerMinPriceUSD=&offerMaxPriceUSD=&projectDomainId=&keywordSearchTerm=&keywordExactSearch=&domains=&offerTypesFilter=all", {
        //     headers : {
        //         'Cookie': finalTokenAndCookie.COOKIE
        //     }
        // })
        return finalTokenAndCookie.COOKIE;
    } catch (error) {
        console.error("❌ Error encountered while fetching data from Presswhizz:", error);

        const { errorDetails, status } = ErrorHandler.handle(error, "No Presswhizz data received.");

        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
