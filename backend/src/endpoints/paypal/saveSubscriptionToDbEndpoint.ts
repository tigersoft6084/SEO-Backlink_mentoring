import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { showSubscription } from "@/services/paypal/subscription/ShowSubscription.ts";
import { Endpoint, PayloadRequest } from "payload";
import crypto from "crypto";

// Define a flexible structure for dynamic plan features
interface DynamicFeatures {
    [key: string]: number; // Dynamic keys (feature names), values are numbers
}

// Define structure for a Plan
interface Plan {
    plan_id: string;
    plan_name: string;
    description: string;
    price: number;
    currency: string;
    features?: DynamicFeatures; // Now optional to prevent TypeScript errors
}

// Define structure for PayPal Plans collection response
interface PayPalPlansDocument {
    product_id: string;
    plans: Plan[];
}

const generateApiKey = async (): Promise<string> => {
    return crypto.randomBytes(32).toString("hex");
};

export const saveSubscriptionToUserCollection: Endpoint = {
    path: "/save-subscription",
    method: "post",
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (req.method === "OPTIONS") {
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
        let userEmail: string | undefined;
        let nextBillingTime: string | undefined;
        let apiKey: string | undefined;
        let subscriptionStatus: string | undefined;

        if (req.json) {
            const body = await req.json();
            planId = body?.planId;
            subscriptionId = body?.subscriptionId;
            planName = body?.planName;
            userEmail = body?.userEmail;
        }

        // Ensure required fields are present
        if (!planId || !subscriptionId || !planName || !userEmail) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: planId, subscriptionId, planName, or userEmail" }),
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
            if (subscriptionId) {
                const subscriptionResponse = await showSubscription(subscriptionId);
                if (typeof subscriptionResponse !== "string") {
                    nextBillingTime = subscriptionResponse?.nextBillingTime;
                    subscriptionStatus = subscriptionResponse?.subscriptionStatus;
                }
                apiKey = await generateApiKey();
            }

            // Fetch plan details from Payload CMS
            const planData = await payload.find({
                collection: "paypal-plans",
                where: {
                    "plans.plan_id": {
                        equals: planId,
                    },
                },
            });

            // Properly cast the fetched data
            const paypalPlansDocs: PayPalPlansDocument[] = planData.docs.map((doc) => ({
                product_id: doc.product_id,
                plans: (doc.plans || []).map((plan) => ({
                    plan_id: plan.plan_id || "",
                    plan_name: plan.plan_name || "",
                    description: plan.description || "",
                    price: plan.price || 0,
                    currency: plan.currency || "USD",
                    features: (plan as Plan).features || {}, // Ensure features always exist
                })),
            }));

            if (!paypalPlansDocs.length) {
                return new Response(
                    JSON.stringify({ error: "Plan not found in database" }),
                    {
                        status: 404,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );
            }

            // Extract the correct plan from all retrieved documents
            const matchedPlan = paypalPlansDocs
                .flatMap((doc) => doc.plans)
                .find((p) => p.plan_id === planId);

            if (!matchedPlan) {
                return new Response(
                    JSON.stringify({ error: "Plan features not found in database" }),
                    {
                        status: 404,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );
            }

            // Ensure features exist
            const selectedFeatures: DynamicFeatures = matchedPlan.features || {};

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
                    features: selectedFeatures, // Now supports dynamic features
                    paypalSubscriptionExpiresAt: nextBillingTime,
                    subscriptionStatus: subscriptionStatus,
                    paypalSubscriptionApiKey: apiKey,
                    usedFeatures: Object.keys(selectedFeatures).reduce((acc, key) => {
                        acc[key] = 0; // Initialize used features dynamically
                        return acc;
                    }, {} as DynamicFeatures),
                },
            });

            return new Response(
                JSON.stringify({ success: "Subscription updated successfully!" }),
                {
                    status: 200,
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
