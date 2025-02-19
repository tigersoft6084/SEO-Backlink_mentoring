import { PAYPAL_API } from "@/globals/globalURLs.ts";
import { createProduct } from "../catalogProducts/CreateProduct.ts";
import { getAccessToken } from "../Authentication.ts";
import { listActivePlans } from "./ListPlan.ts";
import { getProductAndPlanIdFromDB } from "../catalogProducts/getProductsFromDB.ts";
import { Plan, ProductFromDB } from "@/types/paypal.ts";
import { Payload } from "payload";

interface PlanPayload {
    name: string;
    description: string;
    interval_unit: string;
    price: number;
    currency: "USD" | "EUR" | null | undefined;
}

const createPlanPayload = (
    { name, description, interval_unit, price, currency }: PlanPayload,
    productID: string
) => ({
    product_id: productID,
    name,
    description,
    status: "ACTIVE",
    billing_cycles: [
        {
            frequency: {
                interval_unit,
                interval_count: 1, // Monthly subscription
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0, // 0 for infinite billing
            pricing_scheme: {
                fixed_price: {
                    value: price.toString(), // Ensure price is a string as required by PayPal API
                    currency_code: currency,
                },
            },
        },
    ],
    payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
            value: "0", // No setup fee
            currency_code: currency,
        },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
    },
    taxes: {
        percentage: "0",
        inclusive: false,
    },
});

export const createPlansAndGetID = async (payload : Payload): Promise<void> => {
    try {
        const accessToken = await getAccessToken();

        let productFromDB: ProductFromDB | null = null;

        try {
            productFromDB = await getProductAndPlanIdFromDB();
        } catch (dbError) {
            console.error("Error fetching product from the database:", dbError);
        }

        let productID: string;
        let plansFromDB: Plan[] = [];

        // Check if product exists in the database
        if (productFromDB && productFromDB.productID) {
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

        // Fetch active PayPal plans
        const activePayPalPlans = await listActivePlans();

        // Create ID sets for comparison
        const databasePlanIDSet = new Set(plansFromDB.map((dbPlan) => dbPlan.plan_id));
        const payPalPlanIDSet = new Set(activePayPalPlans.map((payPalPlan: { plan_id: string }) => payPalPlan.plan_id));

        console.log('Database Plan IDs:', databasePlanIDSet);
        console.log('PayPal Plan IDs:', payPalPlanIDSet);

        // Define new plans to create
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
            {
                name: "Standard Plan",
                description: "Recommended for SEO freelancers and niche site owners",
                interval_unit: "YEAR",
                price: 150,
                currency: "USD",
            },
            {
                name: "Booster Plan",
                description: "Recommended for agencies, advertisers, and frequent users",
                interval_unit: "YEAR",
                price: 500,
                currency: "USD",
            },
            {
                name: "Spammer Plan",
                description: "Recommended for analyzing large volumes of data and almost unlimited use",
                interval_unit: "YEAR",
                price: 1000,
                currency: "USD",
            },
        ];

        const newPlans: Plan[] = [];

        const isExist = Array.from(databasePlanIDSet).some((planId) =>
            activePayPalPlans.some((payPalPlan: { plan_id: string }) => payPalPlan.plan_id === planId)
        );

        if(!isExist){
            for (const plan of plans) {

                console.log(`Creating new plan: ${plan.name}`);

                const payload = createPlanPayload(plan, productID);

                const response = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "PayPal-Request-Id": `PLAN-${Date.now()}-${plan.name}`,
                        Prefer: "return=representation",
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const error = await response.json();
                    console.error(`Error creating ${plan.name}:`, error);
                    continue;
                }

                const data = await response.json();
                console.log(`${plan.name} Created Successfully:`);

                newPlans.push({
                    plan_name: data.name,
                    plan_id: data.id,
                    description: data.description,
                    interval_unit : data.billing_cycles[0].frequency.interval_unit,
                    price: data.billing_cycles[0].pricing_scheme.fixed_price.value,
                    currency: data.billing_cycles[0].pricing_scheme.fixed_price.currency_code,
                });

                databasePlanIDSet.add(data.id); // Add the new plan ID to the database set
            }
        }

        // Update the database with the new plans
        if (newPlans.length > 0) {
            try {

                const sanitizedPlans = newPlans.map((plan) => ({
                    ...plan,
                    currency: (["USD", "EUR"].includes(plan.currency || "")) ? plan.currency : "USD",
                    price: parseFloat(plan.price.toString()) || 0,  // Ensure price is valid
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
        }

        console.log("All plans processed successfully.");
    } catch (error) {
        console.error("Error creating plans:", error);
    }
};

// export const createPlanForUpdateValues = async(updatedPlan : {plan_name : string, description : string, interval_unit : string, price : number, currency : "USD" | "EUR"}, productID : string) => {

//     const accessToken = await getAccessToken();

//     // Define new plans to create
//     const planForUpdate: PlanPayload =
//         {
//             name: updatedPlan.plan_name,
//             description: updatedPlan.description,
//             interval_unit: updatedPlan.interval_unit,
//             price: updatedPlan.price,
//             currency: updatedPlan.currency,
//         };

//     const payload = createPlanPayload(planForUpdate, productID);

//     const response = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             "PayPal-Request-Id": `PLAN-${Date.now()}-${planForUpdate.name}`,
//             Prefer: "return=representation",
//         },
//         body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//         const error = await response.json();
//         console.error(`Error creating ${planForUpdate.name}:`, error);
//     }

//     // const activePayPalPlans = await listActivePlans();

//     // // Update the database with the new plans
//     // if (activePayPalPlans.length > 0) {
//     //     try {

//     //         const sanitizedPlans = activePayPalPlans.map((plan) => ({
//     //             ...plan,
//     //             currency: (["USD", "EUR"].includes(plan.currency || "")) ? plan.currency : "USD",
//     //             price: parseFloat(plan.price.toString()) || 0,  // Ensure price is valid
//     //         }));

//     //         await req.payload.update({
//     //             collection: "paypal-plans", // Replace with your collection name
//     //             where: {
//     //                 product_id: {
//     //                     equals: productID, // Ensure this matches your database schema
//     //                 },
//     //             },
//     //             data: {
//     //                 plans: [...sanitizedPlans], // Append the new plans to the existing plans
//     //             },
//     //         });
//     //         console.log("Database updated with new plans.");
//     //     } catch (updateError) {
//     //         console.error("Error updating the database with new plans:", updateError);
//     //     }
//     // }
// }
