import PQueue from 'p-queue';
import { uploadToDatabase } from '../uploadDatabase.ts';
import { Payload } from 'payload';
import { GET_BACKLINK_FROM_GROWWER_URL } from '@/globals/globalURLs.ts';
import { fetchDataFromGrowwer } from '../fetchDataFromMarketplaces/growwer.ts';
import { MARKETPLACE_NAME_GROWWER } from '@/globals/strings.ts';

const TOTAL_PAGES = 33100;
const PAGE_STEP = 100; // Pages increment by 100
const CONCURRENCY_LIMIT = 1; // Reduce to 1 request at a time
const BATCH_SIZE = 2; // Process one page at a time
const BASE_DELAY = 8000; // Base delay starts at 8s (increase for Growwer limits)
const MAX_RETRIES = 6; // More retries before skipping
let ADAPTIVE_DELAY = BASE_DELAY;
let consecutive429Errors = 0; // Track rate limit hits

// Function to add random jitter (prevents pattern-based blocking)
const getJitter = () => Math.random() * 3000; // Random jitter up to 3s

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllDataFromGrowwer = async (cookie: string, payload: Payload) => {
    if (!cookie) {
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>();

    const fetchPageData = async (page: number, attempt = 1) => {
        const url = `${GET_BACKLINK_FROM_GROWWER_URL}?page=${page}`;
        console.log(`📡 Fetching page ${page} (Attempt ${attempt})...`);

        try {
            const data = await fetchDataFromGrowwer(url, cookie, page);

            if (Array.isArray(data) && data.length > 0) {
                for (const item of data) {
                    if (!seenDomains.has(item.domain)) {
                        seenDomains.add(item.domain);
                        await uploadToDatabase(payload, item, MARKETPLACE_NAME_GROWWER);
                    }
                }
                console.log(`✅ Processed page ${page}, items: ${data.length}`);

                // Reset rate-limiting if successful
                consecutive429Errors = 0;
                ADAPTIVE_DELAY = BASE_DELAY;
            } else {
                console.warn(`⚠️ No data found on page ${page}.`);
            }
        } catch (error: unknown) {
            if (error instanceof Error && (error as { response?: { status: number } }).response?.status === 429) {
                consecutive429Errors++;

                // Increase delay exponentially with jitter
                ADAPTIVE_DELAY = BASE_DELAY * Math.pow(2, consecutive429Errors) + getJitter();
                console.warn(`🚨 Rate limited on page ${page}. Retrying in ${ADAPTIVE_DELAY / 1000}s...`);

                if (attempt <= MAX_RETRIES) {
                    await delay(ADAPTIVE_DELAY);
                    return fetchPageData(page, attempt + 1);
                } else {
                    console.error(`❌ Max retries reached for page ${page}. Skipping.`);
                }
            } else {
                if (error instanceof Error) {
                    console.error(`❌ Failed to fetch page ${page}: ${error.message}`);
                } else {
                    console.error(`❌ Failed to fetch page ${page}: ${String(error)}`);
                }
            }
        }
    };

    for (let page = 0; page <= TOTAL_PAGES; page += PAGE_STEP) {
        await queue.add(() => fetchPageData(page));

        // Add controlled delay with jitter after each request
        const dynamicDelay = ADAPTIVE_DELAY + getJitter();
        console.log(`⏳ Waiting ${dynamicDelay / 1000}s before next request...`);
        await delay(dynamicDelay);
    }

    console.log('🎉 All pages processed.');
};
