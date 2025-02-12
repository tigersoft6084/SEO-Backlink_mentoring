import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Endpoint, PayloadRequest } from "payload";

export const saveUsedFeaturesToUserCollection: Endpoint = {
    path: '/saveUsedFeatures',
    method: 'post',

    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                }
            });
        }

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const body = await req.json();
        const userEmail: string | undefined = body?.userEmail;

        if (!userEmail) {
            return new Response(
                JSON.stringify({ error: "User email is missing" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // Define a type for usedFeatures
        type UsedFeatures = {
            backlinks?: number;
            plugin?: number;
            keywordSearches?: number;
            competitiveAnalysis?: number;
            serpScanner?: number;
        };

        // Fetch the current user data
        const user = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: userEmail,
                },
            },
        });

        if (!user?.docs?.length) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // Ensure usedFeatures is of correct type
        const existingFeatures: UsedFeatures = user.docs[0].usedFeatures as UsedFeatures || {};

        // Merge new values with existing ones, keeping old values if the new ones are missing
        const toSaveFeatures: UsedFeatures = {
            backlinks: body?.backlinks ?? existingFeatures.backlinks ?? 0,
            plugin: body?.plugin ?? existingFeatures.plugin ?? 0,
            keywordSearches: body?.keywordSearches ?? existingFeatures.keywordSearches ?? 0,
            competitiveAnalysis: body?.competitiveAnalysis ?? existingFeatures.competitiveAnalysis ?? 0,
            serpScanner: body?.serpScanner ?? existingFeatures.serpScanner ?? 0
        };

        await payload.update({
            collection: 'users',
            where: {
                email: {
                    equals: userEmail,
                },
            },
            data: {
                usedFeatures: toSaveFeatures
            }
        });

        return new Response(
            JSON.stringify({ success: "Used Features saved successfully!" }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    })
};
