interface FormattedGetalinkData {
    domain: string;
    tf: number;
    cf: number;
    rd: number;
    price: number;
}

export const getFormDataFromGetalink = async (response: any): Promise<FormattedGetalinkData[] | null> => {
    // Ensure response is valid
    if (!response) {
        throw new Error("No response data");
    }

    try {
        // If `response` is a string, parse it
        const parsedResponse = typeof response === "string" ? JSON.parse(response) : response;

        // Validate that the parsed response has a `data` property
        if (!parsedResponse.data || !Array.isArray(parsedResponse.data)) {
            throw new Error("Invalid response format: missing 'data' array");
        }

        // Extract relevant data
        const extractedData: FormattedGetalinkData[] = parsedResponse.data.map((item: any) => {
            let domain = "";

            if (item.url) {
                try {
                    // If the `url` contains a valid URL, extract the hostname
                    domain = new URL(item.url).hostname;
                } catch {
                    // If the `url` is not a valid URL, assume it is a domain name
                    domain = item.url;
                }
            }

            const formattedDomain = domain
                .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
                .replace(/\/$/, ""); // Remove trailing slash

            return {
                domain : formattedDomain || "unknown", // Use the processed domain or extracted hostname
                tf: item.tf || 0, // Default to 0 if tf is missing
                cf: item.cf || 0, // Default to 0 if cf is missing
                rd: item.rd || 0, // Default to 0 if rd is missing
                price: item.precio_usuario || 0, // Default to 0 if price is missing
            };
        });

        return extractedData;
    } catch (error) {
        console.error("Error processing response:", error);
        return null;
    }
};
