"use client";  // 🚀 Ensures component only runs in the browser

import { useEffect, useState } from "react";
import { getApiKey, saveApiKey } from "../utils/storage";
import { validateApiKey } from "../utils/api";

function LinkFinderExtension() {
    const [apiKey, setApiKey] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (typeof window === "undefined") return; // ✅ Prevent SSR access
        // Check if API key is already saved
        getApiKey((savedKey) => {
        if (savedKey) {
            setIsAuthenticated(true);
        }
        });
    }, []);

    const handleSaveKey = async () => {
        setError(null);

        if (!apiKey) {
        setError("API Key is required!");
        return;
        }

        const isValid = await validateApiKey(apiKey);

        if (isValid) {
        saveApiKey(apiKey);
        setIsAuthenticated(true);
        } else {
        setError("Invalid API Key. Please try again.");
        }
    };

    if (isAuthenticated) {
        return (
        <div className="p-4 w-64 bg-gray-100 dark:bg-gray-800">
            <h2 className="text-lg font-bold">SEO Checker</h2>
            <p>Extension is ready to use!</p>
        </div>
        );
    }

    return (
        <div className="p-4 w-64 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-lg font-bold">Enter API Key</h2>
        <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
            className="w-full p-2 border rounded"
        />
        <button onClick={handleSaveKey} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Save API Key
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}

export default LinkFinderExtension;
