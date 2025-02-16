import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import FormData from 'form-data';

export const fetchDataFromPresswhizz = async (
    url: string,
    finalTokenAndCookie: {
        token : string,
        COOKIE : string,
        csrfToken : string,
        baggageValue : string,
        sentryTraceValue : string,
        checksum : string,
        attributes : {
            'id' : string
        },
        children : Record<string, { fingerprint: string; tag: string }>
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
                    "page": 1,
                    "perPage": 25,
                    "sortBy": "default_sort",
                    "dir": "desc",
                    "portalName": null,
                    "language": null,
                    "country": null,
                    "mainCategory": null,
                    "specialCategory": null,
                    "ahrefsDomainRatingMin": null,
                    "ahrefsDomainRatingMax": null,
                    "ahrefsOrganicTrafficMin": null,
                    "ahrefsOrganicTrafficMax": null,
                    "ahrefsOrganicKeywordsMin": null,
                    "ahrefsOrganicKeywordsMax": null,
                    "ahrefsReferringDomainsMin": null,
                    "ahrefsReferringDomainsMax": null,
                    "mozDomainAuthorityMin": null,
                    "mozDomainAuthorityMax": null,
                    "mozPageAuthorityMin": null,
                    "mozPageAuthorityMax": null,
                    "mozLinkingDomainsMin": null,
                    "mozLinkingDomainsMax": null,
                    "mozLinkPropensityMin": null,
                    "mozLinkPropensityMax": null,
                    "mozSpamScoreMin": null,
                    "mozSpamScoreMax": null,
                    "domainAgeYears": null,
                    "offerMinPriceUSD": null,
                    "offerMaxPriceUSD": null,
                    "projectDomain": "",
                    "keywordSearchTerm": null,
                    "keywordExactSearch": null,
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
                        "organicKeywords": "1",
                        "rd": "1",
                        "linkingDomains": "1",
                        "da": "1",
                        "pa": "1",
                        "mozOrganicTraffic": "1",
                        "spamScore": "1",
                        "age": "1",
                        "cheapestOffer": "1",
                        "_token": finalTokenAndCookie.token
                    },
                    "isValidated": false,
                    "validatedFields": [],
                    "showColumnsSelector": false,
                    "showCountryColumn": true,
                    "showLanguageColumn": true,
                    "showMainCategoryColumn": true,
                    "showTagsColumn": true,
                    "showDrColumn": true,
                    "showOrganicTrafficColumn": true,
                    "showOrganicKeywordsColumn": true,
                    "showRdColumn": true,
                    "showLinkingDomainsColumn": true,
                    "showDaColumn": true,
                    "showPaColumn": true,
                    "showMozOrganicTrafficColumn": true,
                    "showSpamScoreColumn": true,
                    "showAgeColumn": true,
                    "showCheapestOfferColumn": true,
                    "@attributes": finalTokenAndCookie.attributes,
                    "@checksum": finalTokenAndCookie.checksum
                },
                "updated": {
                    "country": "",
                    "language": "",
                    "mainCategory": "",
                    "specialCategory": "",
                    "domainAgeYears": "null"
                },
                "children": finalTokenAndCookie.children,
                "args": {
                    "page": 2,
                    "perPage": 25
                }
            }

        formData.append("data", JSON.stringify(body));

        // console.log("🚀 Sending Request to:", url);
        // console.log("📄 Request Headers:", formData.getHeaders());
        // console.log("🔍 Request Body:", JSON.stringify(body, null, 2));

        console.log(finalTokenAndCookie)

        const response = await axiosInstance.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                'X-CSRF-TOKEN': finalTokenAndCookie.csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                'baggage' : finalTokenAndCookie.baggageValue,
                'sentry-trace' : finalTokenAndCookie.sentryTraceValue,
                'Cookie' : finalTokenAndCookie.COOKIE,
                'Accept' : 'application/vnd.live-component+html',
                'host' : 'app.presswhizz.com',
                'sec-ch-ua' : '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'sec-ch-ua-mobile' : '?0',
                'Sec-Fetch-Site' : 'same-origin',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Mode' : 'cors',
                'Sec-Fetch-Dest' : 'empty',
                'Referer': 'https://app.presswhizz.com/marketplace',
                'Origin': 'https://app.presswhizz.com',
            }
        });

        // const fomatedData = getFormDataFromMPresswhizz(response.data);
        return response.data;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Presswhizz data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
