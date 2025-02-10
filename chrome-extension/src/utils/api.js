"use client";

export async function validateApiKey(apiKey) {
    try {
        const response = await fetch("http://127.0.0.1:2024/api/verify-api-key", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: apiKey })
        });

        if (!response.ok) {
            throw new Error("Invalid API Key");
        }

        return await response.json(); // Return response data if valid
    } catch (error) {
        console.error("API Key Validation Failed:", error.message);
        return null; // Return null if invalid
    }
}

export function normalizeDomain(url) {
    if (!url) return '';

    // Ensure it's an absolute URL, prepend "http://" if it's not
    if (!/^https?:\/\//i.test(url)) {
        url = "http://" + url; // Add "http://" to make it a valid URL
    }

    try {
        const { hostname } = new URL(url); // Parse the URL using the URL constructor
        return hostname.replace(/^www\./, ""); // Remove 'www.' if present
    } catch (e) {
        console.log(e)
        console.error("Invalid URL:", url);
        return "";  // Return empty string if URL is invalid
    }
}


export async function fetchMarketplaceData(domain, apiKey) {

    try {
        const response = await fetch(`http://127.0.0.1:2024/api/get-market-places?marketplaceUrl=${domain}`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const result = await response.json();
        console.log("Backend Response:", result);
        return result;
    } catch (error) {
        console.error("Error fetching SEO data:", error);
        return null;
    }
}
