import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getAccessToken } from "../Authentication.ts";
import { PAYPAL_API } from "@/globals/globalURLs.ts";

interface showSubscriptionResponse{
    billing_info : {
        next_billing_time : string
    }
}

export const showSubscription = async(subscriptionID : string) => {

    if(!subscriptionID){
        throw new Error("Invalid subscription provied.")
    }

    try{

        const accessToken = await getAccessToken();

        const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionID}`, {
            method : 'GET',
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if(!response.ok){
            throw new Error(`Failed to show subscription : ${response.statusText}`);
        }

        const data : showSubscriptionResponse = await response.json();

        const nextBillingTime = data.billing_info.next_billing_time;

        return nextBillingTime;

    }catch(error){

        const { errorDetails } = ErrorHandler.handle(error, "Error fetching subscription creation");
        return errorDetails.context;

    }
}
