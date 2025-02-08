import { Endpoint, PayloadRequest } from "payload";
import { withErrorHandling } from '../../middleware/errorMiddleware.ts';

export const paypalWebhook: Endpoint = {

    path: "/paypal/webhook",

    method: "post",

    handler: withErrorHandling(async (req : PayloadRequest) : Promise<Response> => {

        if (!req.json) {
            throw new Error("Request JSON parser is undefined");
        }

        const body = await req.json();
        const { event_type, resource } = body;
        console.log("Received PayPal Webhook:", event_type);

        if (event_type === "BILLING.SUBSCRIPTION.CANCELLED") {
            await req.payload.update({
                collection: "users",
                where: { subscriptionId: { equals: resource.id } },
                data: {
                    subscriptionId: '',
                    planId: '',
                    paypalSubscriptionExpiresAt: '',
                    paypalSubscriptionApiKey: '',
                },
            });

            console.log(`Subscription ${resource.id} canceled. User access revoked.`);
        }

        return new Response(JSON.stringify({ message: "Webhook received" }), { status: 200 });
    }),
};
