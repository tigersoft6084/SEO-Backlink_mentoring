import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";
import pLimit from "p-limit";
import { fetchDataFromSeojungle } from "../fetchDataFromMarketplaces/seojungle.ts";

const MAX_CONCURRENT_REQUESTS = 10; // Maximum concurrent requests
const limit = pLimit(MAX_CONCURRENT_REQUESTS);

export const getAllDataFromSeojungle = async (
    token: string,
    themes: string[],
    totalPages: number
): Promise<FetchedBackLinkDataFromMarketplace[]> => {
    // Validate token
    if (!token) {
        throw new Error("API token is missing");
    }

    // Progress tracking
    let completedPages = 0;

    const updateProgress = () => {
        completedPages++;
        if (completedPages % 50 === 0 || completedPages === totalPages) {
        console.log(
            `Progress: ${completedPages}/${totalPages} (${Math.round(
            (completedPages / totalPages) * 100
            )}%)`
        );
        }
    };

    const results: FetchedBackLinkDataFromMarketplace[] = [];
    const promises: Promise<void>[] = [];

    // Loop through pages and fetch data
    for (let page = 0; page < totalPages; page++) {
        promises.push(
        limit(() =>
            fetchDataFromSeojungle(token, page, themes)
            .then((data) => {
                if (Array.isArray(data)) {
                    results.push(...data);
                } else {
                    console.error(`Unexpected data format on page ${page}:`, data);
                }
                updateProgress();
            })
            .catch((error) =>
                console.error(`Error processing page ${page}:`, error.message)
            )
        )
        );
    }

    // Wait for all promises to settle
    await Promise.allSettled(promises);

    console.log(
        `Fetched ${results.length} items successfully for themes: ${themes.join(
            ", "
        )}`
    );

    return results;
};
