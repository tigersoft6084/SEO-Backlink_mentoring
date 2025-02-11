import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Endpoint, PayloadRequest } from "payload";

export const updateLocationEndpoint: Endpoint = {
    path: '/update-location',
    method: 'put',
    handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
        const { payload } = req;

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "PUT, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        let email : string | undefined;
        let locationName : string | undefined;

        if(req.json){
            const body = await req.json();
            email = body?.email;
            locationName = body?.locationName;
        }


        if (!email || !locationName) {
            return new Response(
                JSON.stringify({ error: 'Location Name and Email are required' }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    }
                }
            );
        }

        const users = await payload.find({
            collection: 'users',
            where: { email: { equals: email } },
            limit: 1
        });

        if (!users.docs.length) {
            return new Response(
                JSON.stringify({ error: `User not found for email: ${email}` }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const user = users.docs[0];

        const allowedLocations = [
            "United States",
            "Canada",
            "United Kingdom",
            "Spain",
            "France",
            "Germany",
            "Brazil",
            "Portugal",
            "Italy",
            "Belgium",
            "Switzerland",
        ] as const;

        type AllowedLocation = (typeof allowedLocations)[number]; // Extracts valid types

        if (!allowedLocations.includes(locationName as AllowedLocation)) {
            return new Response(
                JSON.stringify({ error: `Invalid location: ${locationName}` }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        await payload.update({
            collection: 'users',
            id: user.id,
            data: { location: locationName as typeof allowedLocations[number] },
        });

        return new Response(
            JSON.stringify({ success: true, message: "Location updated successfully" }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }),
};
