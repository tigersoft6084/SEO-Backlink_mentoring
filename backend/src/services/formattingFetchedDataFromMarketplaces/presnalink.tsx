import { BackLinkData } from "@/types/backlink";

interface NewspaperMetrics {
    tf: number;
    cf: number;
    dr: number;
}

interface Newspaper {
    url?: string;
    metrics?: NewspaperMetrics;
}

interface PrensalinkItem {
    newspapers?: Newspaper[];
    price?: number;
}

export const getFormDataFromPrensalink = (response: any[]): BackLinkData[] | null => {
    try {
        if (!response) {
        console.error("Invalid response data:",);
        throw new Error("Invalid response data. Expected an array within the first item.");
        }

        const dataArray: PrensalinkItem[] = response;
        const allData: BackLinkData[] = [];

        dataArray.forEach((item) => {
            if (item.newspapers && Array.isArray(item.newspapers) && item.newspapers.length > 0) {
                const newspaper = item.newspapers[0];
                const rawDomain = newspaper.url || "Unknown";
                const formattedDomain = rawDomain
                    .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
                    .replace(/\/$/, ""); // Remove trailing slash

                allData.push({
                    domain: formattedDomain,
                    tf: newspaper.metrics?.tf || 0,
                    cf: newspaper.metrics?.cf || 0,
                    rd: newspaper.metrics?.dr || 0,
                    price: item.price || 0,
                });
            } else {
                console.warn("No newspapers found in item:", item);
            }
        });

        return allData.length > 0 ? allData : null;

    } catch (error) {
        console.error("Error processing the response:", error);
        return null;
    }
};
