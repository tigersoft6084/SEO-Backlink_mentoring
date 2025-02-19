// import { createPlanForUpdateValues } from '@/services/paypal/plan/CreatePlan.ts';
import { deactivePlan } from '@/services/paypal/plan/DeactivePlan.ts';
import { CollectionConfig } from 'payload';

const PayPalPlans: CollectionConfig = {
    slug: 'paypal-plans', // The endpoint slug for the collection
    labels: {
        singular: 'PayPal Plan',
        plural: 'PayPal Plans',
    },
    access: {
        create: () => false,
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
    },
    admin: {
        useAsTitle: 'product_id', // Display the `product_id` in the admin panel
    },
    fields: [
        {
            name: 'product_id',
            type: 'text',
            required: true,
            unique: true, // Ensure each product_id is unique
            admin: { readOnly: true }
        },
        {
            name: 'plans',
            type: 'array',
            fields: [
                {
                    name: 'plan_name',
                    type: 'text',

                },
                {
                    name: 'plan_id',
                    type: 'text',
                    unique: true,
                    admin: { readOnly: true },

                },
                {
                    name : 'description',
                    type : 'text',

                },
                {
                    name: 'price',
                    type: 'number',

                },
                {
                    name : 'interval_unit',
                    type : 'text'
                },
                {
                    name: 'currency',
                    type: 'select',
                    options : [
                        {label : 'USD', value : 'USD'},
                        {label : 'EUR', value : 'EUR'}
                    ]
                },
            ],
        },
    ],
    // hooks : {
    //     beforeChange : [
    //         async({data, originalDoc}) => {

    //             if (!originalDoc || !originalDoc.plans) return data;

    //             const updatedPlans = data.plans;
    //             const oldPlans = originalDoc.plans;
    //             let newPlansCreated = false;
    //             const productID = originalDoc.product_id;

    //             for (const updatedPlan of updatedPlans) {
    //                 const existingPlan = oldPlans.find((plan: { plan_id: string }) => plan.plan_id === updatedPlan.plan_id);
    //                 if (!existingPlan) continue; // If it's a new plan, skip.

    //                 // **Step 1: Check if Values Have Changed**
    //                 if (
    //                     updatedPlan.plan_name !== existingPlan.plan_name ||
    //                     updatedPlan.description !== existingPlan.description ||
    //                     updatedPlan.price !== existingPlan.price ||
    //                     updatedPlan.currency !== existingPlan.currency
    //                 ) {
    //                     console.log(`Plan ${existingPlan.plan_id} has changed. Deactivating and creating a new one.`);

    //                     try {
    //                         // **Step 2: Deactivate the Old Plan**
    //                         await deactivePlan(existingPlan.plan_id);

    //                         // **Step 3: Create a New Plan with Updated Values**
    //                         await createPlanForUpdateValues(updatedPlan, productID);

    //                         newPlansCreated = true;
    //                     } catch (error) {
    //                         if (error instanceof Error) {
    //                             console.error(`Error updating PayPal plans: ${error.message}`);
    //                         } else {
    //                             console.error('Error updating PayPal plans:', error);
    //                         }
    //                         throw new Error(`PayPal plan update failed. Rolling back.`);
    //                     }
    //                 }
    //             }

    //             if (newPlansCreated) {
    //                 // Return the data and let `afterChange` handle the PayPal update
    //                 return data;
    //             }

    //             return data;
    //         },
    //     ],

    //         // afterChange : [
    //         //     async({ req, previousDoc}) => {

    //         //         console.log("Fetching latest PayPal plans to update database...");
    //         //         const activePayPalPlans = await listActivePlans();

    //         //         const formattedPlans = activePayPalPlans.map(activePayPalPlan => ({
    //         //             plan_name: activePayPalPlan.name,               // For active plans, use `name`; for updated plans, use `plan_name`
    //         //             plan_id: activePayPalPlan.id,                        // For active plans, use `id`; for updated plans, use `plan_id`
    //         //             currency: activePayPalPlan.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.currency_code as "USD" | "EUR" | undefined,                 // Directly use currency from each plan
    //         //             price: parseInt(activePayPalPlan.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.value ?? '0'),                       // Directly use price from each plan
    //         //             description: activePayPalPlan.description ?? 'No description available'            // Directly use description from each plan
    //         //         }));

    //         //         // **Step 5: Update the PayPal Plans in the Database**
    //         //         try {
    //         //             await req.payload.update({
    //         //                 collection: 'paypal-plans',
    //         //                 where: {
    //         //                     product_id: previousDoc.product_id,
    //         //                 },
    //         //                 data: {
    //         //                     plans: formattedPlans, // Update plans with the latest ones
    //         //                 },
    //         //             });
    //         //             console.log('Updated PayPal plans in the database.');
    //         //         } catch (error) {
    //         //             console.error('Error updating PayPal plans in database:', error);
    //         //         }

    //         //         console.log("Database synchronized with active PayPal plans.");
    //         //     }
    //         // ]
    // }
};

export default PayPalPlans;
