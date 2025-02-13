import { API_KEY, BASE_URL } from "@/config/apiConfig.ts"
import axios from 'axios';

interface Plan {
    plan_name: string;
    plan_id: string;
    description: string;
    price: number;
    currency: string;
    interval_unit : string;
}

export const getPlansForSubscription = async (): Promise<Plan[]> => {

    if(!API_KEY || !BASE_URL) {
        throw new Error('API_KEY or BASE_URL is missing in environment variables.');
    }

    try{

        // Fetch the plans from your backend endpoint
        const response = await axios.get(`${BASE_URL}/paypal-plans`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
        });

        const fetchedPlans = response.data.docs[0].plans; // Assuming `docs` is the array of plans

        const plans: Plan[] = fetchedPlans.map((plan: Plan) => {
            return {
                plan_name: plan.plan_name,
                plan_id: plan.plan_id,
                description: plan.description,
                price: plan.price,
                currency: plan.currency,
                interval_unit : plan.interval_unit
            };
        });
        return plans; // Return the array of plans

    }catch(error){

        if(axios.isAxiosError(error)){
            console.error(
                'Axios Error:',
                error.response?.status,
                error.response?.data || error.message
            );
        }else{
            console.error(
                'Error fetching plans : ',
                error instanceof Error ? error.message : error
            );
        }

        throw new Error('Failed to fetch credentials from the server.');
    }
}