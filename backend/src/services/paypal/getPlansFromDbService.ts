import { API_KEY, BASE_URL } from "@/config/apiConfig.ts"
import axios from 'axios';
import { features } from "process";

interface Plan {
    plan_name: string;
    month_plan_id: string;
    year_plan_id: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    currency: string;
    interval_unit : string;
    results_per_search: number;
    backlinks_monitored: number;
    plugin_clicks: number;
    keyword_searches: number;
    competitive_analyses: number;
    simultaneous_bulk_competitive: number;
    bulk_keywords: number;
    serp_scanner: number;
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
                month_plan_id: plan.month_plan_id,
                year_plan_id: plan.year_plan_id,
                description: plan.description,
                monthly_price: plan.monthly_price,
                yearly_price: plan.yearly_price,
                currency: plan.currency,
                interval_unit : plan.interval_unit,
                results_per_search: plan.results_per_search,
                backlinks_monitored: plan.backlinks_monitored,
                plugin_clicks: plan.plugin_clicks,
                keyword_searches: plan.keyword_searches,
                competitive_analyses: plan.competitive_analyses,
                simultaneous_bulk_competitive: plan.simultaneous_bulk_competitive,
                bulk_keywords: plan.bulk_keywords,
                serp_scanner: plan.serp_scanner,
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