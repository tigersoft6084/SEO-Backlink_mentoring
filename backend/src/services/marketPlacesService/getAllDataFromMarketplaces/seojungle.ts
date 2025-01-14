import { BackLinkData } from "@/types/backlink.ts";
import pLimit from "p-limit";
import { fetchDataFromSeojungle } from "../fetchDataFromMarketplaces/seojungle.ts";

const MAX_CONCURRENT_REQUESTS = 10;
const limit = pLimit(MAX_CONCURRENT_REQUESTS);

export const getAllDataFromSeojungle = async (token : string, themes: string[], totalPages: number): Promise<BackLinkData[]> => {

    if (!token) {
        throw new Error("API token is missing");
    }

    let completedPages = 0;

    const updateProgress = () => {
        completedPages++;
        if (completedPages % 50 === 0 || completedPages === totalPages) {
            console.log(`Progress: ${completedPages}/${totalPages} (${Math.round((completedPages / totalPages) * 100)}%)`);
        }
    };

    const results: BackLinkData[] = [];
    const promises = [];

    for (let page = 0; page < totalPages; page++) {
        promises.push(
            limit(() =>
                fetchDataFromSeojungle(token as string, page, themes)
                    .then((data) => {
                        results.push(...data);
                        updateProgress();
                    })
                    .catch((error) => console.error(`Error processing page ${page}:`, error.message))
            )
        );
    }

    await Promise.allSettled(promises);

    console.log(`Fetched ${results.length} items successfully for themes: ${themes.join(", ")}`);

    return results;

};