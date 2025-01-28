import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { createSubscription } from "@/services/paypal/subscription/CreateSubscription.ts";
import { Endpoint, PayloadRequest } from "payload";

export const paypalSubscriptionEndpoint: Endpoint = {

    path: '/create-subscription',

    method: 'post', // POST is appropriate for creating resources

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        let planID: string | undefined;

        // Check if req.json exists and parse the body
        if (req.json) {
            const body = await req.json();
            planID = body?.planID;
        }

        // Validate if planID is provided
        if (!planID) {
            return new Response(
                JSON.stringify({ error: 'Missing planID in the request body' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Create the subscription
        const approvalUrl = await createSubscription(planID);

        // Return the approval URL as the response
        return new Response(
            JSON.stringify({
                approvalUrl: approvalUrl,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }),
};
