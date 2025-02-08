"use client";

/* global chrome */
export function saveApiKey(apiKey) {
    chrome.storage.sync.set({ apiKey });
}

export function getApiKey(callback) {
    chrome.storage.sync.get("apiKey", (data) => {
        callback(data.apiKey);
    });
}
