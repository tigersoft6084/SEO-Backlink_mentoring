import axios, { AxiosResponse } from "axios";
import pLimit from "p-limit";
import { getTokenForSeoJungle } from "../getTokens/seo-jungle";

const GET_BACKLINK_FROM_SeoJungle_URL = "https://api.seo-jungle.com/support/search";

const MAX_CONCURRENT_REQUESTS = 10;
let cachedToken: string | null = null;
const limit = pLimit(MAX_CONCURRENT_REQUESTS);

const fetchPageData = async (page: number, token: string, themes: string[]): Promise<any> => {
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
        const response: AxiosResponse = await axios.post(GET_BACKLINK_FROM_SeoJungle_URL, body, {
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Organization-Id": "2f26d1f1-c44e-4b92-b03e-7121b018ae91",
                Referer: "https://app.seo-jungle.com/",
            },
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error fetching page ${page}:`, error.response?.data || error.message);
        throw new Error(`Failed to fetch page ${page}: ${error.message}`);
    }
};

const fetchDataForThemes = async (themes: string[], totalPages: number) => {
    // Retrieve and cache token if not already cached
    if (!cachedToken) {
        cachedToken = await getTokenForSeoJungle();
        console.log("Token retrieved:", cachedToken);
    }

    if (!cachedToken) {
        throw new Error("API token is missing");
    }

    let completedPages = 0;

    const updateProgress = () => {
        completedPages++;
        if (completedPages % 50 === 0 || completedPages === totalPages) {
            console.log(`Progress: ${completedPages}/${totalPages} (${Math.round((completedPages / totalPages) * 100)}%)`);
        }
    };

    const results: any[] = [];
    const promises = [];

    for (let page = 0; page < totalPages; page++) {
        promises.push(
            limit(() =>
                fetchPageData(page, cachedToken as string, themes)
                    .then((data) => {
                        results.push(data);
                        updateProgress();
                    })
                    .catch((error) => console.error(`Error processing page ${page}:`, error.message))
            )
        );
    }

    await Promise.allSettled(promises);

    console.log(`Fetched ${results.length} pages successfully for themes: ${themes.join(", ")}`);
    return results;
};

export const fetchAllData = async () => {
    const themeSets = [
        { themes: ["Actu du web", "Actualités - Médias généraliste", "Adultes - Rencontre - Sexe", "Agriculture", "Animaux"], totalPages: 463 },
        { themes: ["Assurance - Mutuelle", "Auto - Moto", "B2B - Entrepreneurs - Marketing - Communication", "Banque - Finance - Economie", "Beauté"], totalPages: 563 },
    ];

    const allResults: any[] = [];

    for (const { themes, totalPages } of themeSets) {
        const results = await fetchDataForThemes(themes, totalPages);
        allResults.push(...results);
    }

    console.log(`Total results fetched: ${allResults.length}`);
    return allResults;
};
