import { PAYPAL_API } from "@/globals/globalURLs.ts";
import { getAccessToken } from "../Authentication.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";

interface PayPalLink {
    href: string;
    rel: string;
    method: string;
}

interface PayPalResponse {
    links: PayPalLink[];
}

export const createSubscription = async(planID : string) => {

    try{

        const accessToken = getAccessToken();

        const subscriptionPayload = {
            "plan_id" : planID,
            "application_context" : {
                "brand_name": "Link Finder",
                "return_url": "http://localhost:1212/returnUrl",
                "cancel_url": "https://localhost:1212/cancelUrl"
            }
        }

        const response = await fetch(`${PAYPAL_API}//v1/billing/subscriptions`, {
            method : 'POST',
            headers : {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "PayPal-Request-Id": `SUBSCRIPTION-${Date.now()}`,
                Prefer: "return=representation",
            },
            body : JSON.stringify(subscriptionPayload)
        })

        if(!response.ok){
            throw new Error(`Failed to create subscription : ${response.statusText}`);
        }

        const data : PayPalResponse = await response.json();

        // Find the approval link
        const approvalUrl = data.links.find((link) => link.rel === "approve")?.href;

        if (!approvalUrl) {
            throw new Error("Approval URL not found in PayPal response");
        }

        return approvalUrl; // Return the approval URL

    }catch(error){

        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Paperclub");
        return errorDetails.context;

    }
}