import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { getPlansForSubscription } from "@/services/paypal/getPlansFromDbService.ts";
import { Endpoint } from "payload";

export const getPlansFromDbEndpoint : Endpoint = {

    path : '/plans',

    method : 'get',

    handler : withErrorHandling(async() => {
        // Fetch the plans from your backend endpoint
        const fetchedPlans = await getPlansForSubscription();

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // You can replace '*' with specific domains for security reasons
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        // Return the array of plans
        return new Response(
            JSON.stringify({ fetchedPlans }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                },
            }
        );
    })
}