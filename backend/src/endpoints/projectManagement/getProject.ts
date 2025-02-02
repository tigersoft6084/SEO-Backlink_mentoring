import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Endpoint, PayloadRequest } from "payload";

export const getUserProjects: Endpoint = {
    path: "/get-projects",

    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {

        const { payload } = req;

        const { email } = req.query;

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const users = await payload.find({
            collection: "users",
            where: { email: { equals: email } },
            limit: 1,
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify(`❌ Error: User not found for email: ${email}`),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        return new Response(JSON.stringify(users.docs[0].projects ?? []), { status: 200 });
    }),
};
