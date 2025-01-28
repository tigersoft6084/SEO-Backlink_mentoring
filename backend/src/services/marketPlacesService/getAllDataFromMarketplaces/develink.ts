import { GET_BACKLINK_FROM_DEVELINK_URL } from "@/globals/globalURLs.ts";
import PQueue from "p-queue";
import { fetchDataFromDevelink } from "../fetchDataFromMarketplaces/develink.ts";

import { uploadToDatabase } from "../uploadDatabase.ts";
import { Payload } from "payload";

const TOTAL_PAGES = 1411;
const CONCURRENCY_LIMIT = 100;
const BATCH_SIZE = 500;

export const getAllDataFromDevelink = async (cookie: string, payload: Payload) => {
    if (!cookie) {
        throw new Error("API cookie is missing");
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>();

    const fetchPageData = async (page: number) => {
        const url = `${GET_BACKLINK_FROM_DEVELINK_URL}?page=${page}`;
        try {
            console.log(`Fetching Develink page ${page}...`);
            const data = await fetchDataFromDevelink(url, cookie);

            if (data && Array.isArray(data)) {
                for (const item of data) {
                    if (!seenDomains.has(item.domain)) {
                        seenDomains.add(item.domain); // Track processed domain
                        await uploadToDatabase(payload, item, "Develink"); // Upload to database
                    }
                }
            } else {
                console.warn(`No data fetched for page ${page}`);
            }
        } catch (error) {
            console.error(
                `Failed to fetch data for page ${page}:`,
                error instanceof Error ? error.message : error
            );
        }
    };

    for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);

        const tasks = [];
        for (let page = start; page <= end; page++) {
            tasks.push(queue.add(() => fetchPageData(page)));
        }

        await Promise.all(tasks);
    }

    console.log("Develink data processing complete.");
};
