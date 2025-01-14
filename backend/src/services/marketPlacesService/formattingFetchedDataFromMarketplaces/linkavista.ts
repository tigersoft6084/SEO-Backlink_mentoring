import * as cheerio from "cheerio";

interface LinkavistarResult {
    domain: string;
    tf: number;
    cf: number;
    rd: number;
    ttf: string;
    price: number;
}

export const getFormDataFromLinkavistar = async (response: any): Promise<LinkavistarResult[] | null> => {
    try {
        // Ensure response is valid and contains HTML
        if (!response || typeof response !== "string") {
            throw new Error("Invalid response data. Expected a string.");
        }

        // Load the HTML content into cheerio
        const $ = cheerio.load(response);

        // Find the script block containing websitesData
        let websitesData: any[] | null = null as any[] | null;

        $('script').each((index, element) => {
            const scriptContent = $(element).html() || '';
            if (scriptContent.includes('let websitesData =')) {
                // Extract the JSON part of websitesData
                const match = scriptContent.match(/let websitesData\s*=\s*(\[[\s\S]*?\]);/);
                if (match && match[1]) {
                    websitesData = JSON.parse(match[1]); // Parse JSON
                }
            }
        });

        if (!websitesData) {
            throw new Error("No websitesData found in the response.");
        }

        // Process and format the extracted data
        const formattedResult: LinkavistarResult[] = websitesData.map((website : any) => {
            // Dynamically find the TTF with the highest value
            const ttfs = Object.keys(website)
                .filter((key) => key.startsWith("ttf") && !key.endsWith("_value"))
                .map((ttfKey) => ({
                    name: website[ttfKey],
                    value: website[`${ttfKey}_value`] || 0,
                }))
                .filter((ttf) => ttf.name && ttf.value > 0);

            const highestTtf = ttfs.reduce(
                (prev, curr) => (curr.value > prev.value ? curr : prev),
                { name: "Unknown", value: 0 }
            );

            const rawDomain = website.domain || "Unknown";
            const formattedDomain = rawDomain
                .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."

            // Return the formatted result
            return {
                domain: formattedDomain,
                tf: website.tf || 0,
                cf: website.cf || 0,
                rd: website.rd || 0,
                ttf: highestTtf.name,
                price: (website.credit || 0) / 100,
            };
        });

        // Return the formatted results
        return formattedResult;
    } catch (error) {
        console.error("Error processing the page:", error);
        return null; // Return null in case of an error
    }
};
