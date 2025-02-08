import axios from "axios";
import { API_KEY, BASE_URL } from "@/config/apiConfig.ts";
import { ProductFromDB } from "@/types/paypal.ts";

export const getProductAndPlanIdFromDB = async (): Promise<ProductFromDB | null> => {
    if (!API_KEY || !BASE_URL) {
        console.error("API_KEY or BASE_URL is missing in environment variables.");
        return null;
    }

    try {
        const response = await axios.get(`${BASE_URL}/paypal-plans`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
        });

        const responseData = response.data;

        if (!responseData.docs || !Array.isArray(responseData.docs) || responseData.docs.length === 0) {
            console.warn("No product or plans found in the response.");
            return null;
        }

        const productData = responseData.docs[0];

        if (!productData.product_id || !productData.plans) {
            console.warn("Incomplete product data in response.");
            return null;
        }

        // Ensure `price` is converted to string if needed
        const plans = productData.plans.map((plan: { price: number }) => ({
            ...plan,
            price: String(plan.price), // Convert price to string
        }));

        return {
            productID: productData.product_id,
            plans,
        };
    } catch (error) {
        console.error("Error fetching product and plans:", error);
        return null;
    }
};
