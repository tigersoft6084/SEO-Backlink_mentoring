import { Endpoint, PayloadRequest } from "payload";
import { withErrorHandling } from '../../middleware/errorMiddleware.ts';

export const getUserPlan: Endpoint = {
    path: "/get-user-plan",
    method: "get",

    handler: withErrorHandling(async (req: PayloadRequest) : Promise<Response> => {
        const { email } = req.query;
        const { payload } = req;

        if (!email) {
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
            const user = await payload.find({
                collection: "users",
                where: { email: { equals: email } },
                limit: 1,
            });

            if (!user.docs.length) {
                return new Response(
                    JSON.stringify({ error: "User not found." }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                );
            }

            const userPlanData = user.docs[0] || null;
            return new Response(
                JSON.stringify({ userPlanData}),
                    {
                        status: 200, // Success status corrected
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
            );
        } catch (error) {
        console.error("Error fetching user plan:", error);
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
