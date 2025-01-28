import { PAYPAL_API } from "@/globals/globalURLs.ts";
import { getAccessToken } from "../Authentication.ts";

export const listActivePlans = async (): Promise<any[]> => {
    const accessToken = await getAccessToken();
    const activePlans: any[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await fetch(
            `${PAYPAL_API}/v1/billing/plans?page_size=20&page=${currentPage}&total_required=true`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Prefer: "return=representation",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch plans: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.plans && data.plans.length > 0) {
            // Filter for active plans only
            const filteredPlans = data.plans.filter((plan: any) => plan.status === "ACTIVE");
            activePlans.push(...filteredPlans);
        }

        // Check for more pages
        hasMore = data.hasOwnProperty("links") && data.links.some((link: any) => link.rel === "next");
        currentPage += 1;
    }

    return activePlans;
};
