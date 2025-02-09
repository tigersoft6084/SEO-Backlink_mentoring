import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Endpoint } from "payload";

export const verifyApiKey : Endpoint = {

    path : '/verify-api-key',

    method : 'post',

    handler : withErrorHandling(async(req) : Promise<Response> => {

        const json = req.json ? await req.json() : {};
        const { key } = json;

        // ✅ Find user by paypalSubscriptionApiKey in Payload CMS
        const user = await req.payload.find({
            collection: "users",
            where: { paypalSubscriptionApiKey: { equals: key } },
        });

        if (!user.docs.length) {
            return new Response(JSON.stringify({ message: "API_KEY is not accessable." }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "API_KEY is sucessfully granted." }), { status: 200 });
    })
}