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


export async function fetchSEOData(url, apiKey) {
    try {
        const response = await fetch(`https://localhost:2024/api/seo-data?url=${encodeURIComponent(url)}`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching SEO data:", error);
        return null;
    }
}
