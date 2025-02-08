import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { PayloadRequest } from "payload";

export const requireSubscription = async (req: PayloadRequest) : Promise<Response> => {
    try {
        // ✅ Check if user is authenticated
        if (!req.user) {
            return new Response(JSON.stringify({ message: "User not authenticated" }), { status: 403 });
        }

        // ✅ Find user in Payload CMS
        const user = await req.payload.find({
            collection: "users",
            where: { email: { equals: req.user.email } },
        });

        // ✅ Block users without active subscriptions
        if (!user || !user.docs[0]?.subscriptionId) {
            return new Response(JSON.stringify({ message: "Subscription required" }), { status: 403 });
        }

        // ✅ Allow request to proceed (Payload CMS handles the rest)
        return new Response(JSON.stringify({ message: "Subscription verified, access granted." }), { status: 200 });
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, 'Error fetching SERP data.');
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
