import { FetchedBackLinkDataFromMarketplace } from '@/types/backlink.js';
import * as cheerio from 'cheerio';

export const getFormDataFromPublisuites = (data: string): FetchedBackLinkDataFromMarketplace[] => {
    try {
        if (!data || typeof data !== "string") {
            throw new Error("Invalid response data. Expected a string.");
        }

        const $ = cheerio.load(data);
        const websites: FetchedBackLinkDataFromMarketplace[] = [];
        const processedDomains = new Set<string>();

        $('.card-pressmedia-page').each((_, element) => {
            const url = $(element).find('.col-website-offer a').attr('href')?.trim() || '';

            if (!url) return;

            // Format domain properly (remove http://, https://, www.)
            const formattedDomain = url.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");

            if (processedDomains.has(formattedDomain)) return;

            let tf = 0, cf = 0, price = 0;
            let language = 'N/A';
            let ttf = 'N/A';

            // Extract TF and CF
            $(element).find('.metric-box-card-table').each((__, metric) => {
                const metricLabel = $(metric).find('.p-metric-name').text().trim();
                const metricValue = parseInt($(metric).find('.p-v2').text().trim()) || 0;

                if (metricLabel === 'TF') tf = metricValue;
                if (metricLabel === 'CF') cf = metricValue;
            });

            // Extract TTF
            $(element).find('.p-icon-press').each((__, langElement) => {
                const ttfText = $(langElement).text().trim();
                if (ttfText.length > 2 && !ttfText.includes("METRICS") && !ttfText.includes("SEO")) {
                    ttf = ttfText;
                }
            });

            // Extract Language (English, Spanish, etc.)
            const langMatch = $(element).find('.p-icon-press').text().match(/\b(English|Spanish|French|German|Portuguese|Italian|Dutch|Russian|Chinese|Japanese|Korean|Arabic|Hindi)\b/);
            if (langMatch) {
                language = langMatch[0];
            }

            // Extract Price
            const discountedPrice = $(element).find('.premium-price-table-box p').text().trim();
            const originalPrice = $(element).find('.text-through-websiteprice').text().trim();

            if (discountedPrice) {
                price = parseInt(discountedPrice.replace('€', '').trim()) || 0;
            } else if (originalPrice) {
                price = parseInt(originalPrice.replace('€', '').trim()) || 0;
            }

            // Validate and store results
            if (formattedDomain && tf > 0 && cf > 0 && price > 0) {
                websites.push({ domain: formattedDomain, tf, cf, language, ttf, price });
                processedDomains.add(formattedDomain);
            }
        });

        return websites;
    } catch (error) {
        console.error('Error occurred while fetching data:', error instanceof Error ? error.message : error);
        return [];
    }
};
