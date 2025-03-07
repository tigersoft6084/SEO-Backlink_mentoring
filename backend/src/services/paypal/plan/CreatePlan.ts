import { PAYPAL_API } from "@/globals/globalURLs.ts";
import { createProduct } from "../catalogProducts/CreateProduct.ts";
import { getAccessToken } from "../Authentication.ts";
import { listActivePlans } from "./ListPlan.ts";
import { getProductAndPlanIdFromDB } from "../catalogProducts/getProductsFromDB.ts";
import { Plan, ProductFromDB } from "@/types/paypal.ts";
import { Payload } from "payload";
import { deactivePlan } from "./DeactivePlan.ts";

interface PlanPayload {
    name: string;
    description: string;
    interval_unit: "MONTH" | "YEAR";
    price: number;
    currency: "USD" | "EUR";
}

const INTERVAL_PRICE_MULTIPLIERS: Record<string, number> = {
    MONTH: 1,
    YEAR: 10,
};

// Helper function to create plan payload
const createPlanPayload = (
    { name, description, interval_unit, price, currency }: PlanPayload,
    productID: string
) => {
    const adjustedPrice = (price * INTERVAL_PRICE_MULTIPLIERS[interval_unit]).toFixed(2);

    return {
        product_id: productID,
        name,
        description,
        status: "ACTIVE",
        billing_cycles: [
            {
                frequency: {
                    interval_unit,
                    interval_count: 1,
                },
                tenure_type: "REGULAR",
                sequence: 1,
                total_cycles: 0,
                pricing_scheme: {
                    fixed_price: {
                        value: adjustedPrice.toString(),
                        currency_code: currency || "USD", // Ensure currency is always valid
                    },
                },
            },
        ],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
                value: "0",
                currency_code: currency || "USD",
            },
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3,
        },
        taxes: {
            percentage: "0",
            inclusive: false,
        },
    };
};

// ✅ Function to create new PayPal plans and save them to Payload CMS
export const createPlansAndGetID = async (payload: Payload): Promise<void> => {
    try {
        const accessToken = await getAccessToken();
        const productFromDB: ProductFromDB | null = await getProductAndPlanIdFromDB();
        let productID: string;
        let plansFromDB: Plan[] = [];

        if (productFromDB?.productID) {
            productID = productFromDB.productID;
            plansFromDB = productFromDB.plans || [];
        } else {
            console.log("No product found in the database. Creating a new product.");
            const productResponse = await createProduct();
            productID = productResponse.id;

            await payload.create({
                collection: "paypal-plans",
                data: {
                    product_id: productID,
                    plans: [],
                },
            });

            console.log("New product saved to the database:", productID);
        }

        const activePayPalPlans = await listActivePlans();
        const databasePlanIDs = new Set(plansFromDB.flatMap(plan => [plan.month_plan_id, plan.year_plan_id].filter(Boolean)));
        const payPalPlanIDs = new Set(activePayPalPlans.map(plan => plan.plan_id));

        console.log("Database Plan IDs:", databasePlanIDs);
        console.log("PayPal Plan IDs:", payPalPlanIDs);

        const plans: PlanPayload[] = [
            {
                name: "Standard Plan",
                description: "Recommended for SEO freelancers and niche site owners",
                interval_unit: "MONTH",
                price: 15,
                currency: "USD",
            },
            {
                name: "Booster Plan",
                description: "Recommended for agencies, advertisers, and frequent users",
                interval_unit: "MONTH",
                price: 50,
                currency: "USD",
            },
            {
                name: "Spammer Plan",
                description: "Recommended for analyzing large volumes of data and almost unlimited use",
                interval_unit: "MONTH",
                price: 100,
                currency: "USD",
            },
        ];

        const newPlans: Plan[] = [];

        const isExist = Array.from(databasePlanIDs).some((planId) =>
            activePayPalPlans.some((payPalPlan: { plan_id: string }) => payPalPlan.plan_id === planId)
        );

        if(!isExist){
            for (const plan of plans) {
                if (databasePlanIDs.has(plan.name)) {
                    console.log(`Skipping existing plan: ${plan.name}`);
                    continue;
                }

                console.log(`Creating new plan: ${plan.name}`);

                const monthPlanPayload = createPlanPayload({ ...plan, interval_unit: "MONTH" }, productID);
                const yearPlanPayload = createPlanPayload({ ...plan, interval_unit: "YEAR" }, productID);

                // ✅ Use Promise.all to create both plans in parallel
                const [monthResponse, yearResponse] = await Promise.all([
                    fetch(`${PAYPAL_API}/v1/billing/plans`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "PayPal-Request-Id": `PLAN-${Date.now()}-${plan.name}-MONTH`,
                        },
                        body: JSON.stringify(monthPlanPayload),
                    }),
                    fetch(`${PAYPAL_API}/v1/billing/plans`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "PayPal-Request-Id": `PLAN-${Date.now()}-${plan.name}-YEAR`,
                        },
                        body: JSON.stringify(yearPlanPayload),
                    }),
                ]);

                if (!monthResponse.ok || !yearResponse.ok) {
                    console.error(
                        `Error creating ${plan.name}:`,
                        await monthResponse.json(),
                        await yearResponse.json()
                    );
                    continue;
                }

                const monthData = await monthResponse.json();
                const yearData = await yearResponse.json();

                console.log(`${plan.name} Created Successfully.`);

                newPlans.push({
                    plan_name: plan.name,
                    plan_id: monthData.id, // Storing the monthly plan ID
                    description: plan.description,
                    monthly_price: plan.price,
                    yearly_price: plan.price * INTERVAL_PRICE_MULTIPLIERS.YEAR,
                    currency: plan.currency,
                    month_plan_id: monthData.id,
                    year_plan_id: yearData.id,
                    interval_unit: "MONTH", // ✅ Ensuring interval_unit is present
                });

                databasePlanIDs.add(monthData.id);
                databasePlanIDs.add(yearData.id);
            }
        }


        // Update the database with the new plans
        // ✅ Update the database with the new plans
        if (newPlans.length > 0) {
            try {

                const sanitizedPlans = newPlans.map((plan) => ({
                    ...plan,
                    currency: (["USD", "EUR"].includes(plan.currency || "")) ? plan.currency : "USD",
                }));

                await payload.update({
                    collection: "paypal-plans", // Replace with your collection name
                    where: {
                        product_id: {
                            equals: productID, // Ensure this matches your database schema
                        },
                    },
                    data: {
                        plans: [...plansFromDB, ...sanitizedPlans], // Append the new plans to the existing plans
                    },
                });
                console.log("Database updated with new plans.");
            } catch (updateError) {
                console.error("Error updating the database with new plans:", updateError);
            }
        } else {
            console.warn("No new plans created, skipping database update.");
        }

        console.log("All plans processed successfully.");
    } catch (error) {
        console.error("Error creating plans:", error);
    }
};


export const createPlanForUpdateValues = async (
    updatedPlan: {
        plan_name: string;
        description: string;
        interval_unit: "MONTH" | "YEAR";
        monthly_price?: number;
        yearly_price?: number;
        currency: "USD" | "EUR";
        month_plan_id?: string; // ✅ Now included
        year_plan_id?: string;  // ✅ Now included
    },
    productID: string,
    shouldDeactivateMonth: boolean = false, // Controls whether the month plan should be deactivated
    shouldDeactivateYear: boolean = false  // Controls whether the year plan should be deactivated
) => {
    const accessToken = await getAccessToken();

    // Validate and format price
    const validatedPrice = (price?: number) => (typeof price === "number" && !isNaN(price) ? price.toFixed(2) : "0.00");

    // Ensure price values exist
    const monthPrice = validatedPrice(updatedPlan.monthly_price);
    const defaultYearlyPrice = updatedPlan.monthly_price ? updatedPlan.monthly_price * 10 : 0;
    const yearPrice = validatedPrice(updatedPlan.yearly_price !== undefined ? updatedPlan.yearly_price : defaultYearlyPrice);

    // Prepare payloads
    const monthPlanPayload = createPlanPayload({
        ...updatedPlan,
        name: updatedPlan.plan_name,
        interval_unit: "MONTH",
        price: parseFloat(monthPrice),
    }, productID);

    const yearPlanPayload = createPlanPayload({
        ...updatedPlan,
        name: updatedPlan.plan_name,
        interval_unit: "YEAR",
        price: parseFloat(yearPrice),
    }, productID);

    console.log(`Processing PayPal plans for ${updatedPlan.plan_name}...`);

    let monthPlanId = null;
    let yearPlanId = null;

    if (shouldDeactivateMonth && updatedPlan.month_plan_id) {
        console.log(`Deactivating existing MONTH plan...`);
        await deactivePlan(updatedPlan.month_plan_id); // ✅ Guaranteed to be a string
    } else if (shouldDeactivateMonth) {
        console.warn(`Skipping MONTH plan deactivation: No valid month_plan_id found.`);
    }

    if (shouldDeactivateYear && updatedPlan.year_plan_id) {
        console.log(`Deactivating existing YEAR plan...`);
        await deactivePlan(updatedPlan.year_plan_id); // ✅ Guaranteed to be a string
    } else if (shouldDeactivateYear) {
        console.warn(`Skipping YEAR plan deactivation: No valid year_plan_id found.`);
    }

    // Create only the necessary plans
    if (shouldDeactivateMonth) {
        console.log(`Creating new MONTH plan for ${updatedPlan.plan_name}...`);
        const monthResponse = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "PayPal-Request-Id": `PLAN-${Date.now()}-${updatedPlan.plan_name}-MONTH`,
            },
            body: JSON.stringify(monthPlanPayload),
        });

        if (monthResponse.ok) {
            const monthData = await monthResponse.json();
            monthPlanId = monthData.id;
        } else {
            console.error(`Error creating MONTH plan for ${updatedPlan.plan_name}:`, await monthResponse.json());
        }
    }

    if (shouldDeactivateYear) {
        console.log(`Creating new YEAR plan for ${updatedPlan.plan_name}...`);
        const yearResponse = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "PayPal-Request-Id": `PLAN-${Date.now()}-${updatedPlan.plan_name}-YEAR`,
            },
            body: JSON.stringify(yearPlanPayload),
        });

        if (yearResponse.ok) {
            const yearData = await yearResponse.json();
            yearPlanId = yearData.id;
        } else {
            console.error(`Error creating YEAR plan for ${updatedPlan.plan_name}:`, await yearResponse.json());
        }
    }

    return {
        success: !!(monthPlanId || yearPlanId),
        month_plan_id: monthPlanId,
        year_plan_id: yearPlanId,
    };
};
