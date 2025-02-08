interface Features {
    resultsPerSearch: number;
    backlinks: number;
    plugin: number;
    keywordSearches: number;
    competitiveAnalysis: number;
    bulkCompetitive: number;
    bulkKeywords: number;
    SerpScanner: number;
}

interface User {
    role: string;
    username: string;
    email: string;
    planId: string;
    subscriptionId: string;
    features: Features;
    planName: string;
    paypalSubscriptionExpiresAt : string;
    paypalSubscriptionApiKey : string;
}