import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { showSubscription } from "@/services/paypal/subscription/ShowSubscription.ts";
import { Endpoint, PayloadRequest } from "payload";
import crypto from "crypto";

// Define plan features outside for better performance
const planFeatures: {
    [key: string]: {
        resultsPerSearch: number;
        backlinks: number;
        plugin: number;
        keywordSearches: number;
        competitiveAnalysis: number;
        bulkCompetitive: number;
        bulkKeywords: number;
        SerpScanner: number;
    };
} = {
    "Standard Plan": {
        resultsPerSearch: 300,
        backlinks: 100,
        plugin: 200,
        keywordSearches: 50,
        competitiveAnalysis: 20,
        bulkCompetitive: 3,
        bulkKeywords: 0,
        SerpScanner: 0,
    },
    "Booster Plan": {
        resultsPerSearch: 1000,
        backlinks: 500,
        plugin: 1000,
        keywordSearches: 250,
        competitiveAnalysis: 100,
        bulkCompetitive: 15,
        bulkKeywords: 20,
        SerpScanner: 20,
    },
    "Spammer Plan": {
        resultsPerSearch: 30000,
        backlinks: 2000,
        plugin: 5000,
        keywordSearches: 2000,
        competitiveAnalysis: 500,
        bulkCompetitive: 40,
        bulkKeywords: 100,
        SerpScanner: 50,
    },
};

const generateApiKey = async() => {
    return crypto.randomBytes(32).toString("hex");
}


export const saveSubscriptionToUserCollection: Endpoint = {

    path: "/save-subscription",

    method: "post",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const { payload } = req;

        if (req.method === "OPTIONS") {
            // Handle preflight requests
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        let planId: string | undefined;
        let planName: string | undefined;
        let subscriptionId: string | undefined;
        let userEmail : string | undefined;
        let nextBillingTime : string | undefined;
        let apiKey : string | undefined;

        if (req.json) {
            const body = await req.json();
            planId = body?.planId;
            subscriptionId = body?.subscriptionId;
            planName = body?.planName;
            userEmail = body?.userEmail;
        }

        // Ensure required fields are present
        if (!planId || !subscriptionId || !planName) {
            return new Response(
                JSON.stringify({ error: "Missing planId, subscriptionId, or planName" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        try {

            if (!userEmail) {
                return new Response(
                    JSON.stringify({ error: "User ID is missing" }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );
            }

            if(subscriptionId){
                nextBillingTime = await showSubscription(subscriptionId);
                apiKey = await generateApiKey();
            }

            const selectedFeatures = planFeatures[planName] || {};

            // Update user subscription in Payload CMS
            await payload.update({
                collection: "users",
                where: {
                    email: {
                        equals: userEmail,
                    },
                },
                data: {
                    planId,
                    subscriptionId,
                    planName,
                    features: selectedFeatures,
                    paypalSubscriptionExpiresAt : nextBillingTime,
                    paypalSubscriptionApiKey : apiKey
                },
            });

            return new Response(
                JSON.stringify({ success: "Subscription updated successfully!" }),
                {
                    status: 200, // Success status corrected
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );

        } catch (error) {

            console.error("Error updating user subscription:", error);

            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                }
            );
        }
    }),
};
