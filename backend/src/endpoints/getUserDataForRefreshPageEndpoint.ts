import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Endpoint } from "payload";

export const getUserDataForRefreshPageEndpoint : Endpoint = {

    path : '/usrInfo',

    method : 'get',

    handler : withErrorHandling(async (req) : Promise<Response> => {

        const authHeader = req.headers.get('authorization');

        if(!authHeader || !authHeader.startsWith('Bearer')){
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 200 });
        }

        // ✅ Find user by email in Payload CMS
        const user = await req.payload.find({
            collection: "users",
            where: { email: { equals: req.user?.email } },
        });

        if (!user.docs.length) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const userData = user.docs[0];

        return new Response(JSON.stringify({
            user: {
                id: userData.id,
                email: userData.email,
                planId: userData.planId,
                planName: userData.planName,
                features: userData.features,
                subscriptionId : userData.subscriptionId
            },
        }), { status: 200 });
    })
}