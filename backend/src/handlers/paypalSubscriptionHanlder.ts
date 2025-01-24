import { createSubscription } from "@/services/paypal/subscription/CreateSubscription.ts"

export const paypalSubscriptionHandler = async (planID : string) => {

  try{

    const approvalUrl = createSubscription(planID);

    return approvalUrl;
  }catch(error){

    throw error;

  }

}